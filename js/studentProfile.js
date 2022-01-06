let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");
let studentName = getStudentName(studentIndex);
let studentLastName=  getStudentLastName(studentIndex);
let profilePhotoPath = getStudentProfilePhoto(studentIndex);

function displayInfo(){
    let nameLabel = document.getElementById("studentNameLabel");
    let indexLabel = document.getElementById("studentIndexLabel");
    let profilePhoto = document.getElementById("studentProfilePhoto");
    
    nameLabel.innerText = studentName + " " + studentLastName;
    indexLabel.innerText = studentIndex;
    profilePhoto.src = (profilePhotoPath != null ? profilePhotoPath : "img/user.png");
}

function displayTests() {
    let list = document.getElementById("testList");
    let tests = getFinishedTests();

    clearContainer(list);

    for(i=0; i<tests.length; i++){
        addFinishedTest(list, tests[i].id, tests[i].name, 0);
    }

}

function viewTest(id){
    document.location = "studentViewTest.html?index=" + studentIndex + "&test=" + id;
}

function goBack(e){
    e.preventDefault();
    document.location = "studentTests.html?index=" + studentIndex;
}

$(document).ready(function(){
    displayInfo();
    displayTests();
});