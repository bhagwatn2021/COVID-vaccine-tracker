const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

//REGISTRATION HANDLER: This is responsible for tracking eligibility statuses of
//states, as well as matching people to a particular vaccine.

//addDoses: when new doses of a vaccine are produced, the function adds the doses
//to Firestore.
exports.registerPatient  = functions.https.onRequest(async (req, res) => {

    const street = req.query.street
    const city = req.query.city
    const state = req.query.state
    const zip = req.query.zip
    const name = req.query.name

    const location = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ street + "," + city + "," + zip + "," + "&key=AIzaSyA0_8woEiWrTYWyqF-x97h3NgJT2YVBRPk");
    var registryRef = admin.firestore().collection('registry');
    const firestore = admin.firestore();

    const patient = await registryRef.add({
      appointments: null,
      location: {
        latitude: location.data.results[0].geometry.location.lat,
        longitude: location.data.results[0].geometry.location.lng,
      },
      address: street + "," + city + "," + state + " " + zip,
      name: name,
      state: state,
    });
    res.send(patient.id);
});

/* -------------
Code for analysis of data
--------------*/
//getAppointments: get the current number of appointments available for a certain state
exports.getAppointments = functions.https.onRequest(async (req, res) => {

    const patientId = req.query.patientId;

    //Get the population
    const patientRef = admin.firestore().collection('registry').doc(patientId);
    const patient = await registryRef.get();
    if(!patient.data.appointments){
      res.send(false);
      return;
    }
    res.send(true);
});

//isVaccinated: returns whether a certain person is vaccinated
exports.isVaccinated = functions.https.onRequest(async (req, res) => {

    const patientId = req.query.patientId;

    //Get the population
    const patientRef = admin.firestore().collection('registry').doc(patientId);
    const patient = await registryRef.get();

    res.send(patient.data().vaccinated);
});

//getPatient: get the current vaccinated population for a certain state
exports.getPatient = functions.https.onRequest(async (req, res) => {

    const patientId = req.query.patientId;

    //Get the population
    const patientRef = admin.firestore().collection('registry').doc(patientId);
    const patient = await registryRef.get();
    res.json(patient.data());

});
