let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");

function goBack(e){
    e.preventDefault();
    document.location = "testList.html?index=" + studentIndex;
}

$(document).ready(function(){
    failIcon = document.getElementsByClassName("failed");
    failIcon.style.visibility = "Hidden";
});