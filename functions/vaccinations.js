const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

//VACCINATIONS HANDLER: This is responsible for tracking eligibility statuses of
//states, as well as matching people to a particular vaccine.

//assignAppointment: when a new appointment is created, the function assigns a person inside an eligibility phase in a state
//to that appointment
exports.assignAppointment = functions.https.onRequest(async (req, res) => {

  //Get the new appointment
  const appointmentId = req.query.appointmentId;
  const patientId = req.query.patientId;

  console.log(patientId)
  //Get the patient and its appointments already booked/completed
  const registryRef = admin.firestore().collection('registry').doc(patientId);
  const patient = await registryRef.get();

  var patientAppointments;

  if(patient.data().appointments){
      patientAppointments = patient.data().appointments;
  }
  else{
      patientAppointments = []
  }
  //Get the appointment from the appointments collection
  const appointmentRef = admin.firestore().collection('appointments').doc(appointmentId);
  const appointment = await appointmentRef.get();

  //Get the appointment from the clinic
  const clinicRef = admin.firestore().collection('state').doc(appointment.data().clinic.state).collection('clinic').doc(appointment.data().clinic.clinicId);
  const clinic = await clinicRef.get();

  var clinicAppointments;

  if(clinic.data().appointments){
      clinicAppointments = clinic.data().appointments;
  }
  else{
      clinicAppointments = [];
  }

  var clinicAppointmentToChange;
  //Set the patient's and clinic's appointment data
  for(var i = 0; i < clinicAppointments.length; i++){
    //console.log(clinicAppointments[i]);
    if(clinicAppointments[i].appointmentId == appointmentId){
      console.log(clinicAppointments[i].appointmentId)
      clinicAppointmentToChange = clinicAppointments[i];
      clinicAppointmentToChange.patient = patient.data();
    }
  }
  patientAppointments.push(clinicAppointmentToChange);

  //Make updates in Firestore
  await appointmentRef.update({
    patient:{
      patientId: patient.id,
      ...patient.data(),
    },
  });

  await clinicRef.update({
    appointments: clinicAppointments,
  });
  console.log(patientAppointments);
  await registryRef.update({
    appointments: patientAppointments,
  });

  res.send("");
});

//recordVaccination: when a person holding an appointment is vaccinated, updates the status of the appointment
exports.recordVaccination = functions.https.onRequest(async (req, res) => {
    const appointmentId = req.query.appointmentId;

    //References to appointments
    const appointmentsRef = admin.firestore().collection("appointments").doc(appointmentId);

    const appointments = await appointmentsRef.update({
      complete: true,
      time: admin.firestore.FieldValue.serverTimestamp(),
    });

    const appointment = await appointmentsRef.get();

    //References to state and clinic data
    const patientRef = admin.firestore().collection("registry").doc(appointment.data().patient.patientId);
    const patient = await patientRef.get();

    //
    const stateRef = admin.firestore().collection("state").doc(appointment.data().clinic.state);
    const clinicRef = stateRef.collection("clinic").doc(appointment.data().clinic.clinicId);
    const clinic = await clinicRef.get();

    var patientAppointments = patient.data().appointments;
    var clinicAppointments = clinic.data().appointments;

    var isVaccinated = false;

    for(var i = 0; i< patientAppointments.length; i++){
      if(patientAppointments[i].appointmentId == appointmentId){
        patientAppointments[i].complete = true;
        if(patientAppointments[i].vaxid == "MODERNA-2" || patientAppointments[i].vaxid == "PFIZER-2" || patientAppointments[i].vaxid == "JANSSEN-1"){
          isVaccinated = true;
        }
      }
    }

    await patientRef.update({
      appointments: patientAppointments,
      isVaccinated: isVaccinated,
    });

    for(var i = 0; i< clinicAppointments.length; i++){
      if(clinicAppointments[i].appointmentId == appointmentId){
        clinicAppointments[i].complete = true;
      }
    }

    await clinicRef.update({
      appointments: clinicAppointments,
    });
    console.log(patient.data().state)
    const patientStateRef = admin.firestore().collection("state").doc(patient.data().state);
    if(isVaccinated){
      const state = await patientStateRef.get();
      var vaccinatedPopulation = state.data().vaccinated_population;

      vaccinatedPopulation = vaccinatedPopulation + 1;
      await patientStateRef.update({
        vaccinated_population: vaccinatedPopulation,
      });
    }

    res.send("");
});

/*----------------------------
Code for analysis of data
-----------------------------*/

//getVaccinatedPopulation: get the current vaccinated population
exports.getVaccinatedPopulation = functions.https.onRequest(async (req, res) => {

    //Get the population
    const stateRef = admin.firestore().collection("state");
    const state = await stateRef.get();
    var vaccinatedPopulation = 0;

    for(doc of state.docs){
      const stateData = doc.data();
      if(stateData.vaccinated_population){
        console.log(stateData.vaccinated_population);
        vaccinatedPopulation = vaccinatedPopulation + stateData.vaccinated_population;
      }
    }

    res.json(vaccinatedPopulation);

});

//getVaccinatedPopulationByState: get the current vaccinated population for a certain state
exports.getVaccinatedPopulationByState = functions.https.onRequest(async (req, res) => {

    const state = req.query.state;
    //Get the population of the
    const stateRef = admin.firestore().collection('state').doc(state);
    const stateData = await stateRef.get();
    res.json(stateData.data().vaccinated_population);
});

//getVaccinationsByClinic: get the current number of doses administered for a certain clinic
exports.getVaccinationsByClinic = functions.https.onRequest(async (req, res) => {

    const clinicId = req.query.clinicId;
    //Get the population
    const clinicRef = admin.firestore().collectionGroup("clinic").doc(clinicId);
    const clinic = await registryRef.get();
    const vaccinations = registry.filter(doc => doc.data().appointments != null);

    res.json(vaccinatedPopulation);
});
