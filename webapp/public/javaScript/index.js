/**
 * Stores the variables from the form in localstorage.
 */
function saveParams() {
    //Store
    localStorage.setItem("disease", $("#myInput").val());           //Disease
    localStorage.setItem("contentType", $("#contentType").val());   //Content type
    localStorage.setItem("topn",  $("#topn").val());                //Topn
    window.location.assign("resultPage.html");
}