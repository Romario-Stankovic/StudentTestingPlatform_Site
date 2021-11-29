function studentLogin(e){
    e.preventDefault();
    
    let indexNumber = document.getElementById("indexField").value;
    
    if(getStudent(indexNumber) != -1){
        window.location = "studentTests.html?index=" + indexNumber;
    }else{
        let errorMessage = document.getElementById("loginErrorMessage");
        errorMessage.style.visibility = "visible";
        errorMessage.innerText = "There is no student with the given index number!";
    }
}

function professorLogin(e){
    e.preventDefault();

    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
}