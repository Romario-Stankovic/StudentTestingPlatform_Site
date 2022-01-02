let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");
let studentName = getStudentName(studentIndex);
let studentLastName=  getStudentLastName(studentIndex);
let profilePhotoPath = getStudentProfilePhoto(studentIndex);

function displayInfo(){
    nameLabel = document.getElementById("studentNameLabel");
    indexLabel = document.getElementById("studentIndexLabel");
    profilePhoto = document.getElementById("studentProfilePhoto");
    
    nameLabel.innerText = studentName + " " + studentLastName;
    indexLabel.innerText = studentIndex;
    profilePhoto.src = profilePhotoPath != null ? profilePhotoPath : "img/user.png";
}

function displayTests() {
    let testHTML = `
    <div class="test">
        <p>$(testName)</p>
        <button class="blueButton" onclick="startTest($(testID));">View</button>
    </div>
    `;

    list = document.getElementById("testList");
    list.innerHTML = "";
    let tests = getFinishedTests();

    for(i=0; i<tests.length; i++){
        list.innerHTML += (testHTML.replace("$(testName)", tests[i].name).replace("$(testID)", tests[i].testID));
    }

}

function goBack(){
    document.location = "studentTests.html?index=" + studentIndex;
}

$(document).ready(function(){
    displayInfo();
    displayTests();
});