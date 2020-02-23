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
exports.webApi = functions.https.onRequest(app);

// post tracker data in corresponding session
// path that triggers this 
//   = https://us-central1-(...).cloudfunctions.net/webApi/api/v1/session
app.post('/session', (request, response) => {
    response.set('Cache-Control', 'private');
    //response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, UPDATE, PUT");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Allow-Credentials", "true");
       
    // check if user has persistent cookie or session cookie
    const permCookieId = request.cookies['user_cookie'];
    const seshCookieId = request.cookies['session_cookie'];
    var userDoc;
    var seshDoc;
   
    // if persistent cookie IS NOT found add cookie and firestore doc
    if(permCookieId === null) {
        try {
            // [users] -> [{userDoc with random ID}]
            userDoc = firestore.collection('users').doc();
            userDoc.set({path: "from userDoc"});

            // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
            seshDoc = userDoc.collection('sessions').doc();
            seshDoc.set({path: "from sesh"});
            
            // pass cookie string so client can parse and do "document.cookie = {cookie string we make}"
            userExpireDate = new Date(Date.now() + 600000000); // 1 week
            userString = "user_cookie=" + userDoc.id + "; " + "Path=/; " + "Expires=" + userExpireDate;
            seshExpireDate = new Date(Date.now() + 900000); // 15 minutes
            sessionString = "session_cookie=" + seshDoc.id + "; " + "Path=/" + "Expires=" + seshExpireDate;
            response.cookie('user_cookie', useDoc.id, {maxAge: 600000000, httpOnly: true});
            response.cookie('session_cookie', seshDoc.id);
            response.send({user: userString, sesh: sessionString, from: "noPermCookie"});
        } catch (error) {
            response.status(500).send({error: "error in making persistent/session cookie"});
        }
    }
    
    // if persistent cookie IS found add just session cookie and firestore doc
    else if(seshCookieId === null) {
        try {
            const seshDoc = firestore.collection('users').doc(permCookieId).collection('sessions').doc();
            sessionString = "session_cookie=" + seshDoc.id + "; " + "Path=/";
            //response.send({sesh: sessionString, from: "noSeshCookie"});
        } catch (error) {
            response.status(500).send({error: "error in seshCookie make"});
        }
    }
    //response.send({userExist: request.cookies});
    // try {
    //     const data = {
    //         id: request.body.id, 
    //         user_agent: request.body.user_agent,
    //         user_lang: request.body.user_lang,
    //         user_cookies: request.body.user_cookies,
    //         user_js: request.body.user_js,
    //         user_img: request.body.user_img,
    //         user_css: request.body.user_css,
    //         user_max_width: request.body.user_max_width,
    //         user_max_height: request.body.user_max_height,
    //         user_window_width: request.body.user_window_width,
    //         user_window_height: request.body.user_window_height,
    //         user_ect: request.body.user_ect,
    //         performance_load_start: request.body.performance_load_start,
    //         performance_load_end: request.body.performance_load_end,
    //         performance_load_delta: request.body.performance_load_delta,
    //         performance_request_start: request.body.performance_request_start,
    //         performance_response_start: request.body.performance_response_start,
    //         performance_response_end: request.body.performance_response_end,
    //         performance_transfer_size: request.body.performance_transfer_size,
    //         performance_encoded_body_size: request.body.performance_encoded_body_size,
    //         dynamic_clicks: request.body.dynamic_clicks, 
    //         dynamic_moves: request.body.dynamic_moves,
    //         dynamic_keys: request.body.dynamic_keys,
    //         dynamic_scroll: request.body.dynamic_scroll,  
    //         dynamic_idle: request.body.dynamic_idle
    //     }
    // } catch (error) {
    //     response.status(500).send({error: "error getting data"});
    // }
    // try {
    //     let sessionRef = firestore.collection('users')
    //         .doc(userDoc.id)
    //         .collections('sessions')
    //         .doc(seshDoc.id)
    //         .set(data);

    //     let sessionRefData = sessionRef.get();
    //     response.json({
    //         session_data: sessionRefData.data()
    //     });
    // } catch (error) {
    //     response.status(500).send({error: "error putting on firestore"});
    // }
       
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
});

// check if user has persistent/session cookie
// append to existing session doc
// or create new cookies and corresponding docs
app.get('/cookie', (request, response) => {
    // Bypass CORS
    response.set('Cache-Control', 'private')
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    //response.set("Access-Control-Allow-Credentials", true);
        
    // check if user has persistent cookie or session cookie
    const permCookieId = request.cookies['user_cookie'];
    const seshCookieId = request.cookies['session_cookie'];

    // if persistent cookie IS NOT found add cookie and firestore doc
    if(permCookieId === null) {
        try {
            // [users] -> [{userDoc with random ID}]
            const userDoc = firestore.collection('users').doc();
            userDoc.set({path: "from userDoc"});

            // [{userDoc with random ID}] -> [sessions] -> [{sessionDoc with random ID}]
            const seshDoc = userDoc.collection('sessions').doc();
            seshDoc.set({path: "from sesh"});
            
            // pass cookie string so client can parse and do "document.cookie = {cookie string we make}"
            userExpireDate = new Date(Date.now() + 600000000); // 1 week
            userString = "user_cookie=" + userDoc.id + "; " + "Path=/; " + "Expires=" + userExpireDate;
            seshExpireDate = new Date(Date.now() + 900000); // 15 minutes
            sessionString = "session_cookie=" + seshDoc.id + "; " + "Path=/" + "Expires=" + seshExpireDate;
            response.send({user: userString, sesh: sessionString, from: "noPermCookie"});
        } catch (error) {
            response.status(500).send("error in making persistent/session cookie");
        }
    }
    
    // if persistent cookie IS found add just session cookie and firestore doc
    else if(seshCookieId === null) {
        try {
            const seshDoc = firestore.collection('users').doc(permCookieId).collection('sessions').doc();
            sessionString = "session_cookie=" + seshDoc.id + "; " + "Path=/";
            response.send({sesh: sessionString, from: "noSeshCookie"});
        } catch (error) {
            response.status(500).send("error in seshCookie make");
        }
    }
    response.send({userExist: request.cookies});
});

