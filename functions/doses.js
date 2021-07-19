const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");
const axios = require("axios");

//DOSES HANDLER: This is responsible for adding new doses of a vaccine once it becomes available
//addDoses: when new doses of a vaccine are produced, the function adds the doses
//to Firestore.

//Adds a given amount of doses of a vaccine to a clinic
exports.addDoses = functions.https.onRequest(async (req, res) => {
    const vaxid = req.query.vaxid;
    const clinicId = req.query.clinicId;
    const state = req.query.state
    const quantity = parseInt(req.query.quantity);

    const vaccineRef = admin.firestore().collection("vaccine").doc(vaxid);
    const shipmentsRef = vaccineRef.collection("shipments");

    const vaccine = await vaccineRef.get();
    console.log(vaxid);

    const originalDoses = vaccine.data().doses;

    await shipmentsRef.add({
      doses: quantity,
      vaxid: vaxid,
      state: state,
      clinicId: clinicId,
      time: admin.firestore.FieldValue.serverTimestamp(),
    });

    await vaccineRef.update({
      doses: originalDoses + quantity
    });

    res.send("");
});

//When doses are added, this function creates an appointments in a given clinic in a given state.
exports.createAppointment = functions.firestore.document("vaccine/{vaxid}/shipments/{shipmentId}").onCreate(async(change, context) => {
  //We want to check for new doses
  const currentDoses = change.data();

  const clinicId = currentDoses.clinicId;
  const vaxid = currentDoses.vaxid;
  const state = currentDoses.state;
  const doses = currentDoses.doses;

  const appointmentsRef = admin.firestore().collection("appointments");
  const clinicRef = admin.firestore().collection("state").doc(state).collection("clinic").doc(clinicId);

  const clinic = await clinicRef.get();

  var appointments = [];

  if(clinic.data().appointments){
    appointments = clinic.data().appointments;
  }

  console.log(appointments);

  for(var i = 0; i < doses; i++){
    const appointmentRef = await appointmentsRef.add({
      vaxid: vaxid,
      complete: false,
      clinic:{
        clinicId: clinic.id,
        location: clinic.data().location,
        name: clinic.data().name,
        state: clinic.data().state,
      },
      time: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(appointmentRef.id);
    appointments.push({
      vaxid: vaxid,
      appointmentId: appointmentRef.id,
      complete: false,
      clinic:{
        clinicId: clinic.id,
        location: clinic.data().location,
        name: clinic.data().name,
        state: clinic.data().state,
      },
      time: Date.now(),
    });

  }

  await clinicRef.update({
    appointments: appointments
  });

  return;
});
