const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true});
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
app.post('/session', async (request, response) => {
        try {
            const {
                id, 
                user_agent,
                user_lang,
                user_cookies,
                user_js,
                user_img,
                user_css,
                user_max_width,
                user_max_height,
                user_window_width,
                user_window_height,
                user_ect,
                performance_load_start,
                performance_load_end,
                performance_load_delta,
                performance_request_start,
                performance_response_start,
                performance_response_end,
                performance_transfer_size,
                performance_encoded_body_size,
                dynamic_clicks, 
                dynamic_moves,
                dynamic_keys,
                dynamic_scroll,  
                dynamic_idle
            } = request.body;   // populate fields with request body data
            
            const data = {
                id, 
                user_agent,
                user_lang,
                user_cookies,
                user_js,
                user_img,
                user_css,
                user_max_width,
                user_max_height,
                user_window_width,
                user_window_height,
                user_ect,
                performance_load_start,
                performance_load_end,
                performance_load_delta,
                performance_request_start,
                performance_response_start,
                performance_response_end,
                performance_transfer_size,
                performance_encoded_body_size,
                dynamic_clicks, 
                dynamic_moves,
                dynamic_keys,
                dynamic_scroll,  
                dynamic_idle
            }

        //const data = request.body;
        // dataArray will hold list of tracker data for a session
        const dataArray = {
            dataArray: [data]
        }
        // check if user has persistent cookie or session cookie
        const permCookie = request.user_cookies["permCookie"];
        const seshCookie = request.user_cookies["seshCookie"];
        // if persistent cookie is not found add cookie and firestore doc
        if(!permCookie) {
            const newUserRef = firestore.collection('users').doc();
            request.cookie("permCookie", newUserRef.id, {maxAge: 600000000});
        }
        // if session cookie is not found add cookie and firestore doc
        if(!seshCookie) {
            newSessionRef = firestore.collection('users')
                .doc(newUserRef.id)
                .collection('sessions')
                .add(dataArray);
            request.cookie("seshCookie", newSessionRef.id);
        }
        // bypass CORS error
        //response.set("Access-Control-Allow-Origin", "https://my-third-website.firebaseapp.com/");
        //response.set("Access-Control-Allow-Methods", "GET, POST, OPTION");
        //response.set("Access-Control-Allow-Headers", "Content-Type");   
        //response.set("Access-Control-Allow-Credentials", true);

        // append new session to dataArray and to firestore
        let sessionRef = firestore.collection('users')
            .doc(permCookie)
            .collections('sessions')
            .doc(seshCookie)
            .set({
                dataArray: data
            }, {merge: true} ); 
        // get data in new session doc and send back in response body
        let sessionRefData = sessionRef.get();
        response.json({
            data: sessionRefData.data()
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get('/cookie', async (request, response) => {
    
    try {
        // response.setHeader('Cache-Control')
        // response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.set("Access-Control-Allow-Credentials", true);
        response.set("Access-Control-Max-Age", "600000");
        //const permCookie = request.cookies["permCookie"];
        //const seshCookie = request.cookies["seshCookie"];
        //const __session = request.cookies["__session"];
        //response.cookie('__session', "124");
        response.cookie('session_cookie', 'shart');
        response.cookie('user_cookie', 'fortnite', { sameSite: 'none', secure: true, httpOnly: true});
        response.send("hello");
    } catch (error) {
        response.status(500).send(error);
    }
    //     if(!__session) {
    //         response.cookie('__session', '123');
    //         response.send({sesh: __session});
    //         return;
    //     }
    //     // if persistent cookie is not found add cookie and firestore doc
    //     if(!permCookie) {
    //         const newUserRef = firestore.collection('users').doc();
    //         request.cookie("permCookie", 
    //                         newUserRef.id, {
    //                         maxAge: 600000000,
    //                         httpOnly: true,
    //                         secure: true
    //                         });
    //     }
    //     // if session cookie is not found add cookie and firestore doc
    //     if(!seshCookie) {
    //         newSessionRef = firestore.collection('users')
    //             .doc(newUserRef.id)
    //             .collection('sessions')
    //             .add(dataArray);
    //         request.cookie("seshCookie", newSessionRef.id);
    //     }
    //     response.set("Access-Control-Allow-Origin", "https://my-third-website.firebaseapp.com/");
    //     response.set("Access-Control-Allow-Methods", "GET");
    //     response.set("Access-Control-Allow-Headers", "Content-Type");
    //     response.set("Access-Control-Allow-Credentials", true);
    //     response.set("Access-Control-Max-Age", "3600");
    //     response.send({user_cookie: newUserRef.id, session_cookie: newSessionRef.id });
    // } catch (error) {
    //     response.status(500).send(error);
    // }
});