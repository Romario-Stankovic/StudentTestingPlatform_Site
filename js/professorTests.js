let urlParams = new URLSearchParams(window.location.search);
let professorName = urlParams.get("name");

function displayProfessorInfo(){
    
    let professorBriefLabel = document.getElementById("professorBrief");
    if(professorName != null){
        professorBriefLabel.innerText = professorName;
    }
}

function displayTests() {
    let list = document.getElementById("testList");
    let tests = getAvailableTests();

    clearContainer(list);

    for(i=0; i<tests.length; i++){
        addEditableTest(list, tests[i].id, tests[i].name);
    }
}

function logout(){
    document.location = "professorLogin.html";
}

function refreshTestList(){
    displayTests();
}

$(document).ready(function(){
    displayProfessorInfo();
    displayTests();
});