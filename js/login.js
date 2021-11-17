function studentLogin(e){
    let indexNo = document.getElementById("indexField").value;
    e.preventDefault();
    console.log(indexNo);
}

function professorLogin(e){
    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;
    e.preventDefault();
    console.log(username + " - " + password);
}