let identity;

$(async function() {
    await displayStudentInfo();

    displayActiveTests();
})

async function displayStudentInfo() {
    let studentBrief = document.getElementById("studentBrief");

    let identityResponse = await apiHandler(APIController.getIdentity);

    if(identityResponse == undefined){
        alert("Could not contact API");
        studentLogout();
        return;
    }

    if (identityResponse.statusCode != undefined) {
        switch (identityResponse.statusCode) {
            case 401:
                studentLogout();
                break;
            case 4001:
                studentLogout();
                break;
            default:
                console.log(identityResponse);
        }
        return;
    }

    if (identityResponse.role != "student") {
        studentLogout();
    }

    identity = identityResponse;

    studentBrief.innerText = identity.firstName + " " + identity.lastName + " - " + identity.indexNumber;

}

async function displayActiveTests() {

    let testList = document.getElementById("testList");
    
    clearContainer(testList);

    let testsResponse = await apiHandler(APIController.getActiveTests);

    if(testsResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if (testsResponse.statusCode != undefined) {
        switch (test.statusCode) {
            case 401:
                studentLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                testList.innerText = "No active tests";
                break;
            default:
                console.log(testsResponse);
        }
        return;
    }

    for (let test of testsResponse) {
        addActiveTest(testList, test.testId, test.testName);
    }

}

async function startTest(testId) {
    let data = {
        studentId: identity.id,
        testId: Number.parseInt(testId)
    }

    let workResponse = await apiHandler(APIController.startWork, data);

    if(workResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if (workResponse.statusCode != undefined) {
        switch (workResponse.statusCode) {
            case 400:
                alert("Bad request");
                break;
            case 401:
                studentLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1001:
                alert("Failed to start test");
                break;
            case 3001:
                alert("Failed to start test (bad test)");
                break;
            default:
                console.log(workResponse);
        }
        return;
    }

    let questions = workResponse.questions;

    workInfo = {
        workId : workResponse.workId,
        testName: workResponse.testName,
        questions: questions,
        currentQuestion: 0,
        questionDuration: 0,
        endsAt: workResponse.endsAt
    }

    sessionStorage.setItem("workInfo", JSON.stringify(workInfo));
    window.location = "studentQuestion.html";
}

function goToStudentProfile(event) {
    event.preventDefault();
    window.location = "studentProfile.html";
}

function refreshActiveTests(){
    displayActiveTests();
}
