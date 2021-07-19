Please follow this guide when you are transferring data from production:

firebase login
gcloud auth login

2. See a list of your projects and connect to one:

firebase projects:list
firebase use vaccine-tracker-2c2b6

gcloud projects list
gcloud config set project vaccine-tracker-2c2b6

3. Export your production data to gcloud bucket with chosen name:

gcloud firestore export gs://vaccine-tracker-2c2b6.appspot.com/firestore-test-data

4. Now copy this folder to your local machine, I do that in functions folder directly:

cd functions
gsutil -m cp -r gs://vaccine-tracker-2c2b6.appspot.com/firestore-test-data .
