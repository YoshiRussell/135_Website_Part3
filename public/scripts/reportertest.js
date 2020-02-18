function loadHandler() {
    var purgeBtn = document.getElementById('purge');
    var entry_list = document.getElementById("entries");
    
    // clear everything from storage
    purgeBtn.onclick = function() {
        var c = confirm("Are you sure you want to purge everything?");
        if(c) {
            localStorage.clear();
            document.getElementById('entries').innerHTML = '';
        }
    }

    // add links from storage
    for(var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var entry = document.createElement('li');
        entry.setAttribute('id', key);
        var entry_link = document.createElement('a');
        entry.appendChild(entry_link);
        entry_link.setAttribute('href', '#');
        entry_link.innerHTML = key;
        entry_list.appendChild(entry);   
        entry_list.appendChild(entry);
    }
    
    // add click event to all links
    entry_list.addEventListener('click', function(e) {
        for(var i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if(e.target.innerText == key) {
                addTable(key);
            }
        }
    });
    
}

// create table for link clicked
function addTable(key) {
    var entry_table = document.createElement('table');
    var entry_table_body = document.createElement('tbody');
    var this_entry = document.getElementById(key);
    var retrieveData = localStorage.getItem(key);
    var parsedData = JSON.parse(retrieveData);
    var keyDiv = document.createElement('div');
    var keyBody = "";
    var clickDiv = document.createElement('div');
    var clickBody = "";
    var mouseDiv = document.createElement('div');
    var mouseBody = "";
    var scrollDiv = document.createElement('div');
    var scrollBody = "";
    var idleDiv = document.createElement('div');
    var idleBody = "";
    var entry_close_btn = document.createElement('button');
    var purge_entry_btn = document.createElement('button');
    var key_btn = document.createElement('a');
    var click_btn = document.createElement('a');
    var mouse_btn = document.createElement('a');
    var scroll_btn = document.createElement('a');
    var idle_btn = document.createElement('a');
    
    entry_table.appendChild(entry_table_body);
    this_entry.appendChild(entry_table);
    for(var i = 0; i < parsedData.length; i++) {
        if(parsedData[i] == "Static Information" ||
           parsedData[i] == "Performance Information" ||
           parsedData[i] == "Dynamic Information") {
            
            let head = document.createElement('h1');
            head.innerHTML = '<tr>' + parsedData[i] + '</tr>';
            entry_table_body.appendChild(head);
        } else {
            if(parsedData[i] == "KEY EVENT LOG<br>") {
        
                keyBody += "<b>Key Log:</b><br>" + parsedData[i + 1];
                i += 1;
            }
            else if(parsedData[i] == "CLICK EVENT LOG<br>") {
                
                clickBody += "<b>Click log:</b><br>" + parsedData[i + 1];
                i += 1;
            }
            else if(parsedData[i] == "MOUSE EVENT LOG<br>") {

                mouseBody += "<b>Mouse log:</b><br>" + parsedData[i + 1];
                i += 1;
            }
            else if(parsedData[i] == "SCROLL EVENT LOG<br>") {
                
                scrollBody += "<b>Scroll log:</b><br>" + parsedData[i + 1];
                i += 1;
            } 
            else if(parsedData[i] == "IDLE EVENT LOG<br>") {

                idleBody += "<b>The user was idle for:</b><br>" + parsedData[i + 1];
                i += 1;
            }
            else {
                
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.innerHTML = parsedData[i];
                tr.appendChild(td);
                entry_table_body.appendChild(tr);
            }
        }
    }

    // key button and presentation
    keyDiv.setAttribute('id', 'keyDiv');
    keyDiv.innerHTML = keyBody;
    keyDiv.style.display = "none";  
    key_btn.setAttribute('href', '#');
    key_btn.innerHTML = "Key Info<br>";
    key_btn.onclick = function() {
        if(keyDiv.style.display == "none") {
            keyDiv.style.display = "block";
        } else {
            keyDiv.style.display = "none";
        }
    }
    entry_table_body.appendChild(key_btn);
    entry_table_body.appendChild(keyDiv);

    // click button and presentation
    clickDiv.setAttribute('id', 'clickDiv');
    clickDiv.innerHTML = clickBody;
    clickDiv.style.display = "none";
    click_btn.setAttribute('href', '#');
    click_btn.innerHTML = "Click Info<br>";
    click_btn.onclick = function() {
        if(clickDiv.style.display == "none") {
            clickDiv.style.display = "block";
        } else {
            clickDiv.style.display = "none";
        }
    }
    entry_table_body.appendChild(click_btn);
    entry_table_body.appendChild(clickDiv);

    // mouse button and presentation
    mouseDiv.setAttribute('id', 'mouseDiv');
    mouseDiv.innerHTML = mouseBody;
    mouseDiv.style.display = "none";
    mouse_btn.setAttribute('href', '#');
    mouse_btn.innerHTML = "Mouse Info<br>";
    mouse_btn.onclick = function() {
        if(mouseDiv.style.display == "none") {
            mouseDiv.style.display = "block";
        } else {
            mouseDiv.style.display = "none";
        }
    }
    entry_table_body.appendChild(mouse_btn);
    entry_table_body.appendChild(mouseDiv);

    // scroll button and presentation
    scrollDiv.setAttribute('id', 'scrollDiv')
    scrollDiv.innerHTML = scrollBody;
    scrollDiv.style.display = "none";
    scroll_btn.setAttribute('href', '#');
    scroll_btn.innerHTML = "Scroll Info<br>";
    scroll_btn.onclick = function() {
        if(scrollDiv.style.display == "none") {
            scrollDiv.style.display = "block";
        } else {
            scrollDiv.style.display = "none";
        }
    }
    entry_table_body.appendChild(scroll_btn);
    entry_table_body.appendChild(scrollDiv);

    // idle button and presentation
    idleDiv.setAttribute('id', 'idleDiv');
    idleDiv.innerHTML = idleBody;
    idleDiv.style.display = "none";
    idle_btn.setAttribute('href', '#');
    idle_btn.innerHTML = "Idle Info<br>";
    idle_btn.onclick = function() {
        if(idleDiv.style.display == "none") {
            idleDiv.style.display = "block";
        } else {
            idleDiv.style.display = "none";
        }
    }
    entry_table_body.appendChild(idle_btn);
    entry_table_body.appendChild(idleDiv);

    // style of dynamic textboxes
    var divs = entry_table_body.querySelectorAll('div');
    for(var i = 0; i < divs.length; i++) {
        divs[i].style.overflow = "scroll";
        divs[i].style.width = "400px";
        divs[i].style.height = "200px";
        divs[i].style.backgroundColor = "white";
    }

    // close info box
    entry_close_btn.innerText = "Close";
    entry_close_btn.onclick = function() {
        this_entry.removeChild(entry_table);
    }
    entry_table_body.appendChild(entry_close_btn);

    // purge current entry
    purge_entry_btn.innerText = "Purge Entry";
    purge_entry_btn.onclick = function() {
        var c = confirm("Are you sure you want to purge this entry?");
        if(c) {
            localStorage.removeItem(key);
            this_entry.removeChild(entry_table);
            this_entry.parentNode.removeChild(this_entry);
        }
    }
    entry_table_body.appendChild(purge_entry_btn);
}

window.addEventListener('DOMContentLoaded', loadHandler);