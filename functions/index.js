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

// MIDDLE-WARE TO SET COOKIES IF NEEDED
app.use('/newsession', cors(request, response, next => {
    
    // set headers to satisfy CORS
    response.setHeader('Access-Control-Allow-Methods', 'POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Cache-Control', 'private');
    
    // check if user/session cookies exist
    var userCookieID = request.cookies['user_cookie'];
    var sessionCookieID = request.cookies['session_cookie'];

    // if user_cookie doesnt exist make user/session cookie and corresponding docs
    if(userCookieID === null) {
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
    else if(sessionCookieID === null) {
        try {
            // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
            let seshDocPath = firestore.collection('users').doc(userCookieID).collection('sessions').doc();
            seshDocPath.set({path: "from sesh"});
            sessionCookieID = seshDocPath.id;
            response.cookie('session_cookie', sessionCookieID);
        } catch (error) {
            response.status(500).send({error: "error creating session cookie"});
        }
    }

    // to pass to next()
    response.locals.userDocID = userCookieID;
    response.locals.sessionDocID = sessionCookieID;
    next();
}));


// post tracker data in corresponding session
// path that triggers this 
//   = https://us-central1-(...).cloudfunctions.net/webApi/api/v1/session
app.post('/newsession', (request, response) => {
    //return cors(req, res, () => {
        
    // parse request body JSON file
    try {
        const data = {
            id: request.body.id, 
            user_agent: request.body.user_agent,
            user_lang: request.body.user_lang,
            user_cookies: request.body.user_cookies,
            user_js: request.body.user_js,
            user_img: request.body.user_img,
            user_css: request.body.user_css,
            user_max_width: request.body.user_max_width,
            user_max_height: request.body.user_max_height,
            user_window_width: request.body.user_window_width,
            user_window_height: request.body.user_window_height,
            user_ect: request.body.user_ect,
            performance_load_start: request.body.performance_load_start,
            performance_load_end: request.body.performance_load_end,
            performance_load_delta: request.body.performance_load_delta,
            performance_request_start: request.body.performance_request_start,
            performance_response_start: request.body.performance_response_start,
            performance_response_end: request.body.performance_response_end,
            performance_transfer_size: request.body.performance_transfer_size,
            performance_encoded_body_size: request.body.performance_encoded_body_size,
            dynamic_clicks: request.body.dynamic_clicks, 
            dynamic_moves: request.body.dynamic_moves,
            dynamic_keys: request.body.dynamic_keys,
            dynamic_scroll: request.body.dynamic_scroll,  
            dynamic_idle: request.body.dynamic_idle
        }
    } catch (error) {
            response.status(500).send({error: "error getting data"});
    }

    // add data to its rightful spot in firestore
    try {
        let sessionRef = firestore.collection('users')
            .doc(response.locals.userDocID)
            .collections('sessions')
            .doc(response.locals.sessionDocID)
            .set(data);
        let sessionRefData = sessionRef.get();

        // return this through the response body
        response.json({
            session_data: sessionRefData.data()
        });
    } catch (error) {
        response.status(500).send({error: "error putting on firestore"});
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

exports.cookie = functions.https.onRequest(app);

// check if user has persistent/session cookie
// append to existing session doc
// or create new cookies and corresponding docs
