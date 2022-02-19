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

    if(identity == undefined){
        alert("Could not contact API");
        studentLogout();
        return;
    }

    if (identity.statusCode != undefined) {
        switch (identity.statusCode) {
            case 401:
                studentLogout();
                break;
            case 4001:
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
        alert("Could not contact API");
        return;
    }

    if(worksResponse.statusCode != undefined){
        switch(worksResponse.statusCode){
            case 400:
                alert(worksResponse.message);
                break;
            case 401:
                studentLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                testList.innerText = "No available works";
                break;
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