let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");
let studentName = getStudentName(studentIndex);
let studentLastName=  getStudentLastName(studentIndex);

function displayStudentInfo(){
    
    let studentBriefLabel = document.getElementById("studentBrief");
    studentBriefLabel.innerText = studentName + " " + studentLastName + " - " + studentIndex;
}

function displayTests(){

    let testHTML =`
        <div class="test">
            <p>$(testName)</p>
            <button class="greenButton" onclick="startTest($(testID));">Start</button>
        </div>
    `;
    list  = document.getElementById("testList");
    list.innerHTML = "";
    let tests = getAvailableTests();
    for(i=0; i<tests.length; i++){
        list.innerHTML += (testHTML.replace("$(testName)", tests[i].name).replace("$(testID)", tests[i].id));
    }
}

function showProfile(){
    document.location = "studentProfile.html?index=" + studentIndex;
}

function logout(){
    document.location = "login.html";
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