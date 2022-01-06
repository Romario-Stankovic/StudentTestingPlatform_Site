let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");
let studentName = getStudentName(studentIndex);
let studentLastName=  getStudentLastName(studentIndex);

function displayStudentInfo(){
    
    let studentBriefLabel = document.getElementById("studentBrief");
    studentBriefLabel.innerText = studentName + " " + studentLastName + " - " + studentIndex;
}

function displayTests(){
    let list = document.getElementById("testList");
    let tests = getAvailableTests();

    clearContainer(list);

    for(i=0; i<tests.length; i++){
        addActiveTest(list, tests[i].id, tests[i].name);
    }
}

function showProfile(){
    document.location = "studentProfile.html?index=" + studentIndex;
}

function logout(){
    document.location = "studentLogin.html";
}

function startTest(id){
    document.location = "question.html?test=" + id + "&question=0";
}

function refreshTestList(){
    displayTests();
}

$(document).ready(function(){
    displayStudentInfo();
    displayTests();
});