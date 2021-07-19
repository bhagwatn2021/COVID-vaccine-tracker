const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();


const registration = require('./registration');
const doses = require('./doses');
const vaccinations = require('./vaccinations');


//Export functions to endpoint
exports.addDoses = doses.addDoses;
exports.createAppointment = doses.createAppointment;

exports.registerPatient = registration.registerPatient;
exports.getAppointments = registration.getAppointments;
exports.getPatient = registration.getPatient;
exports.isVaccinated = registration.isVaccinated;

exports.assignAppointment = vaccinations.assignAppointment;
exports.recordVaccination = vaccinations.recordVaccination;
exports.getVaccinatedPopulation = vaccinations.getVaccinatedPopulation;
exports.getVaccinatedPopulationByState = vaccinations.getVaccinatedPopulationByState;
exports.getVaccinationsByClinic = vaccinations.getVaccinationsByClinic;
