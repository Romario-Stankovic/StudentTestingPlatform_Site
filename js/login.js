let urlParams = new URLSearchParams(window.location.search);
let loginType = urlParams.get("type");

function displayForm(){
    let studentLogin = document.getElementById("studentForm");
    let professorLogin = document.getElementById("professorForm");

    if(loginType == "professor"){
        studentLogin.remove();
    }else {
        professorLogin.remove();
    }

}

function login(e){
    e.preventDefault();

    if(loginType == "professor"){
        professorLogin();
    }else {
        studentLogin();
    }

}

function studentLogin(){
    
    let indexNumber = document.getElementById("indexField").value;
    
    if(getStudent(indexNumber) != false){
        window.location = "studentTests.html?index=" + indexNumber;
    }else{
        let errorMessage = document.getElementById("loginErrorMessage");
        errorMessage.style.visibility = "visible";
        errorMessage.innerText = "There is no student with the given index number!";
    }
}

function professorLogin(){
    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
}

$(document).ready(function(){
    displayForm();
});