function displayStudentInfo(){
    let infoText = document.getElementById("studentNameAndID");
    let urlParams = new URLSearchParams(window.location.search);
    let studentIndex = urlParams.get("index");
    let studentName = getStudentName(studentIndex);
    let studentLastName=  getStudentLastName(studentIndex);
    
    infoText.innerText = studentName + " " + studentLastName + " - " + studentIndex;
}

function logout(){
    document.location = "studentLogin.html";
}

$(document).ready(function(){
    displayStudentInfo();
})