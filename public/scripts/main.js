document.writeln(`Page generated  on ${new Date()}`); 

/* make max attribute for date the current date */
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if(dd < 10) {
    dd = '0' + dd;
}
if(mm < 10) {
    mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById("b-day").setAttribute("max", today);
