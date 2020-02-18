function loadHandler() {
    resetTimer();
    performanceItems.push("Static Information");
    getStaticData();
    performanceItems.push("Performance Information")
    print_PerformanceEntries();
    performanceItems.push("Dynamic Information");
    dynamicKey();
    dynamicClick();
    dynamicMouse();
    dynamicScroll();
}

var performanceItems = []
var eventExec = false;
var idleTime;
var timer = 0;

function getStaticData() {
    
    // userAgent
    var ua = "User-agent: " + navigator.userAgent;
    performanceItems.push(ua);

    // language
    var ul = "User-language: " + navigator.language;
    performanceItems.push(ul);

    // cookies enabled
    var cookies = "Cookies on: " + navigator.cookieEnabled;
    performanceItems.push(cookies);

    // javascript enabled
    var jsOn = "JavaScript: enabled";
    performanceItems.push(jsOn);
    
    // images enabled
    var img = new Image();
    img.src="/../img/drift.jpg";
    var imgOn = "Images On: ";
    img.onload = function() {
        console.log("image loaded");
        imgOn += true;
    }
    img.onerror = function() {
        console.log("image not loaded");
        imgOn += false;
    }
    performanceItems.push(imgOn);
    
    // css enabled
    var cssOn = "CSS enabled: " + !document.styleSheets[0].disabled;
    performanceItems.push(cssOn);
    
    // available screen size
    var availScreen = "Available Screen Dimensions (h x w): " 
        + screen.availHeight + " x " + screen.availWidth;
    performanceItems.push(availScreen);
    
    // current window size
    var windowSize = "Window Size (h x w): " 
        + window.innerHeight + " x " + window.innerWidth;
    performanceItems.push(windowSize);
    
    // connection type
    var effectiveConn = "Effective Connection Type: "
        + navigator.connection.effectiveType;
    performanceItems.push(effectiveConn);
}

function print_PerformanceEntries() {
    
    var p = performance.getEntries();
    for(var i = 0; i < p.length; i++) {
        print_PerformanceEntry(p[i]);
    }
}

function print_PerformanceEntry(perfEntry) {
    
    var properties = ["name", "entryType", "startTime", "endTime", "duration"];
    for(var i = 0; i < properties.length; i++) {
        var supported = properties[i] in perfEntry;
        if(supported) {
            if(i == 0) {
                var value = '<b>' + perfEntry[properties[i]] + '</b>';
            } else {
                var value = perfEntry[properties[i]];
            }
            if(i >= 2 && i <= 4) {
                value += "ms";
            }
            performanceItems.push(properties[i] + ": " + value);
        } else {
            if(properties[i] == "endTime") {
                var end_time = parseFloat(perfEntry["startTime"]) + parseFloat(perfEntry["duration"]);
                performanceItems.push(properties[i] + ": " + end_time + "ms");
            } else {
                console.log("... " + properties[i] + " is NOT supported");
            }
        }
    }
}

function dynamicKey() {
    window.addEventListener("keydown" , function(event) {
        var attributes = ["key", "keyCode", "shiftKey", "ctrlKey", "altKey"]
        var key_str = "KEY EVENT LOG<br>";
        performanceItems.push(key_str);
        var key_body = "";
        for(var i = 0; i < attributes.length; i++) {
            key_body += attributes[i] + " = " + event[attributes[i]] + "<br>";
        }
        performanceItems.push(key_body);
        resetTimer();
    });
}

function dynamicClick() {
    window.addEventListener("click", function(event) {
        var attributes = ["target", "clientX", "clientY", "screenX", "screenY"];
        var click_str = "CLICK EVENT LOG<br>";
        performanceItems.push(click_str);
        var click_body = "";
        for(var i = 0; i < attributes.length; i++) {
            click_body += attributes[i] + " = " + event[attributes[i]] + "<br>";
        }
        performanceItems.push(click_body);
        resetTimer();
    }, false);
}

function mouseEvents(event) {

    var attributes = ["clientX", "clientY", "screenX", "screenY", "offsetX", "offsetY"];
    var mouse_str = "MOUSE EVENT LOG<br>";
    performanceItems.push(mouse_str);
    var mouse_body = "";
    for(var i = 0; i < attributes.length; i++) {
        mouse_body += attributes[i] + " = " + event[attributes[i]] + "<br>";
    }
    performanceItems.push(mouse_body);
    resetTimer();
}

function dynamicMouse() {
    window.addEventListener("mouseover", mouseEvents);
    window.addEventListener("mousemove", mouseEvents);
}

function dynamicScroll() {
    
    window.addEventListener("scroll", function(event) {
        var attributes = ["scrollY", "scrollX", "scrollSpeed"];
        var scroll_str = "SCROLL EVENT LOG<br>";
        var scroll_body = "";
        performanceItems.push(scroll_str);
        for(var i = 0; i < attributes.length; i++) {
            scroll_body += attributes[i] + " = " + this[attributes[i]] + "<br>"; 
        }
        performanceItems.push(scroll_body);
        resetTimer();
    });
}

function unloading() {
    if(timer > 0) {
        var idle_str = "IDLE EVENT LOG<br>";
        performanceItems.push(idle_str);
        var idle_body = timer + " seconds";
        performanceItems.push(idle_body);
    }
    var page_pth = window.location.pathname;
    // line below was taken from stackoverflow to shorten page name
    var page = page_pth.split("/").pop();
    var date = new Date();
    var key;
    if(page.length > 0) {
        key = page + " - " + date;
    } else {
        key = "index.html" + " - " + date;
    }
    window.localStorage.setItem(key, JSON.stringify(performanceItems));
}

function resetTimer() {
    clearTimeout(idleTime);
    if(timer > 0) {
        var idle_str = "IDLE EVENT LOG<br>";
        performanceItems.push(idle_str);
        var idle_body = timer + " seconds<br>";
        performanceItems.push(idle_body);
        timer = 0;
    }
    idleTime = setTimeout(startTimer, 2000);
}

function startTimer() {
    timer += 1;
    idleTime = setTimeout(startTimer, 1000);
}

window.addEventListener('DOMContentLoaded', loadHandler);
window.addEventListener('beforeunload', unloading);