const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true, credentials: true});
const app = express();

// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBRCReGbRNNm2OBGatwZDmcYj8s0W1E-sg",
    authDomain: "my-third-website.firebaseapp.com",
    databaseURL: "https://my-third-website.firebaseio.com",
    projectId: "my-third-website",
    storageBucket: "my-third-website.appspot.com",
    messagingSenderId: "925927624827",
    appId: "1:925927624827:web:fde7742ec2c991adb212de",
    measurementId: "G-WHRJBNXH50"
  };

  // Initialize App and create reference to our database
admin.initializeApp(firebaseConfig);
var firestore = admin.firestore();
console.log("admin-firestore initialized");

// add path used for receiving requests
app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser());


// post tracker data in corresponding session
// path that triggers this 
//   = https://us-central1-(...).cloudfunctions.net/webApi/api/v1/session
app.post('/newsession', (request, response) => {
    return cors(request, response, () => {
        // set headers to satisfy CORS
        response.setHeader('Access-Control-Allow-Methods', 'POST');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.setHeader('Cache-Control', 'private');
        
        // check if user/session cookies exist
        var userCookieID = request.cookies['user_cookie'];
        var sessionCookieID = request.cookies['session_cookie'];
        
        // grab data from request body
        var data;
        try {
            data = JSON.parse(request.body);
        } catch (error) {
            response.status(500).send({error: "error getting data"});
        }
        
        // if user_cookie doesnt exist make user/session cookie and corresponding docs
        if(userCookieID == null) {
            try {
                // [users] -> [{userDoc with random ID}]
                let userDocPath = firestore.collection('users').doc();
                userDocPath.set({path: "from userDoc"});
                userCookieID = userDocPath.id;
                // set user cookie
                response.cookie('user_cookie', userCookieID, {maxAge: 600000000, httpOnly: true});
            } catch (error) {
                response.status(500).send({error: "error creating user cookie"});
            }
        }

        // if only session cookie doesnt exit, find user doc and add session 
        if(sessionCookieID == null) {
            try {
                // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
                let seshDocPath = firestore.collection('users').doc(userCookieID).collection('sessions').doc();
                let dataArray = [];
                seshDocPath.set(dataArray);
                seshDocPath.collection('entries');
                sessionCookieID = seshDocPath.id;
                response.cookie('session_cookie', sessionCookieID);
            } catch (error) {
                response.status(500).send({error: "error creating session cookie"});
            }
        }

        
        // add data to its rightful spot in firestore
        try {
            let sessionRef = firestore.collection('users')
                .doc(userCookieID)
                .collection('sessions')
                .doc(sessionCookieID)
                .collection('entries').add(data);
            
            //let sessionRefData = sessionRef.get();
            // return this through the response body
            // response.json({
            //     session_data: request.body
            // });
            response.send({path: "done"});
        } catch (error) {
            response.status(500).send({error: "error putting on firestore",
                                    user: userCookieID,
                                    session: sessionCookieID});
        }
            // try {  
            //     // append new session to dataArray and to firestore
            //     let sessionRef = firestore.collection('users')
            //         .doc(newUserRef.id)
            //         .collections('sessions')
            //         .doc(newSessionRef.id)
            //         .set({
            //             dataArray: data
            //         }, {merge: true} ); 
            //     // get data in new session doc and send back in response body
            //     let sessionRefData = sessionRef.get();
            //     response.json({
            //         data: sessionRefData.data()
            //     });
            // } catch (error) {
            //     response.status(500).send(error);
            // }
        //});
    
    });
});

exports.cookie = functions.https.onRequest(app);

// check if user has persistent/session cookie
// append to existing session doc
// or create new cookies and corresponding docs
