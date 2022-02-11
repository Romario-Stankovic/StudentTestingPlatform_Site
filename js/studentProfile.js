let identity;

$(async function () {
    await displayStudentInfo();

    await displayFinishedTests();
})

async function displayStudentInfo() {
    
    let studentNameLabel = document.getElementById("studentNameLabel");
    let studentIndexLabel = document.getElementById("studentIndexLabel");
    let studentProfilePicture = document.getElementById("studentProfilePhoto");

    identity = await apiHandler(APIController.getIdentity);

    if (identity.statusCode != undefined) {
        switch (identity.statusCode) {
            case 401:
                studentLogout();
                break;
            default:
                console.log(identity);
        }
        return;
    }

    if (identity.role != "student") {
        studentLogout();
    }

    studentNameLabel.innerText = identity.firstName + " " + identity.lastName;
    studentIndexLabel.innerText = identity.indexNumber;
    studentProfilePicture.src = identity.imagePath != null ? apiPhotoUrl + identity.imagePath : "img/nouser.png";

}

async function displayFinishedTests(){

    let worksResponse = await apiHandler(APIController.getWork,"student", identity.id);

    let testList = document.getElementById("testList");

    clearContainer(testList);

    if(worksResponse == undefined){
        return;
    }

    if(worksResponse.statusCode != undefined){
        switch(worksResponse.statusCode){
            default:
                console.log(worksResponse);
        }

        return;
    }

    for (let work of worksResponse){
        addFinishedTest(testList, work.workId, work.test.testName, work.points);
    }
}

function goToStudentMain(event) {
    event.preventDefault();
    window.location = "studentMain.html";
}

function viewWork(workId, testName) {
    let resultInfo = {
        professorId : null,
        workId: workId,
        testName: testName
    }
    sessionStorage.setItem("resultInfo", JSON.stringify(resultInfo));

    window.location = "viewWork.html";
}