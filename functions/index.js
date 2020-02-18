// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers
const functions = require('firebase-functions');

// firebase deploy --only functions 
exports.messageHere = functions.https.onRequest((request, response) => {
    response.send("This is a message from Firebase!");
});