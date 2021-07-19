# covid-vaccine-tracker
Tracks COVID-19 doses shipped and assigns appointments at random to people in different eligibility groups.

It also tracks who is vaccinated in a current area. 

This has not been tested on production data, all data is mocked. The intent is to put this into production and connect production data about COVID vaccinations.

To replicate, create a Firebase project and connect it to the project folders using [firebase init]. Then, use [gcloud init] to connect the underlying Google Cloud project to your project. Make sure the Firestore and Cloud Functions emulators are turned on when doing these steps, and use your project name as specified in Firebase as a parameter. 

To run: 
In your terminal on the root of the project directory (one directory above 'functions'):

Run  firebase emulators:start --import ./functions/firestore-test-data


