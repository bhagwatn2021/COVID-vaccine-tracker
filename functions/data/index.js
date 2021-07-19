const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA0_8woEiWrTYWyqF-x97h3NgJT2YVBRPk",
  authDomain: "vaccine-tracker-2c2b6.firebaseapp.com",
  projectId: "vaccine-tracker-2c2b6",
};
// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

const registryObject = require("./registry");
const clinicsObject = require("./clinics");
const statesObject = require("./states");

/* --------------------------------------------------------------------------------------------------------------
Below is the code to insert values into Firestore.
Uncomment each section for each insert you'd like to perform.
-------------------------------------------------------------------------------------------------------------- */

//Insert values into the registry collection.

/* registryObject.forEach(function(obj) {

    db.collection("registry").add({
        appointments: obj.appointments,
        name: obj.name,
        location: {
          latitude: obj.location.latitude,
          longitude: obj.location.longitude,
        },
        state: obj.state
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}); */

//Insert values into the clinics collection under each state.
  /*
  var states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

  for(var i = 0; i<clinicsObject.length;i++){
    const obj = clinicsObject[i];
    db.collection("state").doc(obj.state).collection("clinic").doc(obj.clinicId).set({
        appointments: obj.appointments_allocated,
        name: obj.name,
        location: {
          latitude: obj.location.latitude,
          longitude: obj.location.longitude,
        },
        state: obj.state,
        vaxid: obj.vaxid,
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }
  */

//Insert values about vaccinated population into the states collection.
/*
  for(var i = 0; i<statesObject.length;i++){
    const obj = statesObject[i];
    db.collection("state").doc(obj.State).update({
        population: obj.Pop,
        vaccinated_population: 0
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }
*/

const clinicsRef = await db.collectionGroup("")
