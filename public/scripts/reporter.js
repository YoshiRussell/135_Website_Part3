var idleObj = setTimeout(timeoutHandler, 2000); 
var currentlyIdling = false;
var idleStart, idleEnd, idleTime;
var uniqueKey, fromPage;
var storeToCloud = setTimeout(gatherData, 10000);
function gatherData(){
    
    var mainPerformanceObject = performance.getEntriesByName("load-time")[0];

    var miscPerfomanceObject = 
    performance.getEntries().find( 
        () => PerformanceNavigationTiming 
        );
    
    var newJSON = {
            id : uniqueKey,
            user_agent:  navigator.userAgent,
            user_lang: navigator.language,
            user_cookies: navigator.cookieEnabled,
            user_js: true,
            user_img: false,
            user_css: false,
            user_max_width: screen.width,
            user_max_height: screen.height,
            user_window_width: screen.availWidth,
            user_window_height: screen.availHeight,
            user_ect: navigator.connection.effectiveType,
            performance_load_start: mainPerformanceObject.startTime.toFixed(3),
            performance_load_end: (mainPerformanceObject.startTime + mainPerformanceObject.duration).toFixed(3),
            performance_load_delta:  mainPerformanceObject.duration.toFixed(3),
            performance_request_start: miscPerfomanceObject.requestStart.toFixed(3),
            performance_response_start:  miscPerfomanceObject.responseStart.toFixed(3),
            performance_response_end:  miscPerfomanceObject.responseEnd.toFixed(3),
            performance_transfer_size: miscPerfomanceObject.transferSize,
            performance_encoded_body_size:    miscPerfomanceObject.encodedBodySize,
            dynamic_clicks:  JSON.stringify(mouseClicks),
            dynamic_moves:  JSON.stringify(mouseMoves),
            dynamic_keys:  JSON.stringify(keysPressed),
            dynamic_scroll:  JSON.stringify(scrollEvents),
            dynamic_idle:  JSON.stringify(idleEvents)
    };
    var xhttp = new XMLHttpRequest();
    //xhttp.open("POST", "https://us-central1-my-third-website.cloudfunctions.net/webApi/api/v1/session", true);
    //xhttp.send(newJSON);
    //xhttp.open("GET", "https://us-central1-my-third-website.cloudfunctions.net/webApi/cookie", true);
    xhttp.open("POST", "https://us-central1-my-third-website.cloudfunctions.net/webApi/session");
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            console.log(xhttp.responseText);
        }
    };
    xhttp.setRequestHeader("credentials", "include");
    xhttp.send();
    xhttp.send(newJSON);

}

// There should be small 1x1 gif at the bottom of every page called check-image
// function checkImages(){
//     return document.getElementById('check-image').complete; // this depends on the image being in the html page
// }

performance.mark("pre-load");
window.addEventListener('DOMContentLoaded', beginGatherData);

function beginGatherData(){
    performance.mark("post-load");
    performance.measure("load-time", "pre-load", "post-load");
    var path = window.location.pathname;
    fromPage = path.split("/").pop();
    if(fromPage.length > 0){
        uniqueKey = fromPage + ' - ' + (new Date());
    } else {
        uniqueKey = 'index.html' + ' - ' + (new Date());
    }
    addListeners();
}
let mouseClicks = [];
let mouseMoves = [];
let keysPressed = [];
let scrollEvents = [];
let idleEvents = [];
function addListeners(){
    window.addEventListener("click", e => resetIdle() | mouseClicks.push([e.clientX, e.clientY]) );
    window.addEventListener("mousemove", e =>  resetIdle() | mouseMoves.push([e.clientX, e.clientY]) );
    window.addEventListener("keyup", e => resetIdle() | keysPressed.push(e.key) );
    window.addEventListener("scroll", e => resetIdle() | scrollEvents.push([window.scrollX, window.scrollY]) );
    window.addEventListener("beforeunload", e => resetIdle() | storeData());
}


function resetIdle(){
    clearTimeout(idleObj);
    idleObj = setTimeout(timeoutHandler, 2000); 

    if(currentlyIdling){
        idleEnd = new Date().getTime();
        idleTime = idleEnd - idleStart;
        idleEvents.push([idleTime]);
    }
    currentlyIdling = false;
}
function timeoutHandler(){
    currentlyIdling = true;
    idleStart = new Date().getTime();
}

function logClick(e){
    mouseClicks.push([e.clientX, e.clientY]);
}
function logMove(e){
    mouseMoves.push([e.clientX, e.clientY]);
}
function storeData(e){
    gatherData();
}



