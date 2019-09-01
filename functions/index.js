const functions = require('firebase-functions');

const app = require('express')();

const { getAllScreams } = require('./handlers/screams');
const { signup, login } = require('./handlers/users');

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

//Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);         //FBAuth is th emiddleware for authentication

// users route
app.post('/signup', signup);
app.post('/login', login);




// https://baseurl.com/api/     we are trying to get this prefix here - api
exports.api = functions.region('asia-east2').https.onRequest(app); 
