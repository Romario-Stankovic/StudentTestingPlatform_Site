let identity;

$(async function(){
    hideTestDialog();

    await displayProfessorInfo();
    await displayTests();
})

async function displayProfessorInfo() {
    let professorBrief = document.getElementById("professorBrief");

    let identityResponse = await apiHandler(APIController.getIdentity);

    if (identityResponse.statusCode != undefined) {
        switch (identityResponse.statusCode) {
            case 401:
                logout();
                break;
            default:
                console.log(identityResponse);
        }
        return;
    }

    if (identityResponse.role != "professor") {
        logout();
    }

    identity = identityResponse;

    professorBrief.innerText = identity.firstName + " " + identity.lastName;

}

async function displayTests() {

    let testList = document.getElementById("testList");

    let testsResponse = await apiHandler(APIController.getProfessorTests, identity.id);

    if(testsResponse == undefined){
        return;
    }

    if (testsResponse.statusCode != undefined) {
        switch (testsResponse.statusCode) {
            case 401:
                logout();
                break;
            default:
                console.log(testsResponse);
        }
        return;
    }

    clearContainer(testList);

    for (let test of testsResponse) {
        addEditableTest(testList, test.testId, test.testName);
    }

}

function hideTestDialog() {
    let testOverlay = document.getElementById("testOverlay");
    testOverlay.style.display = "none";
}

function showTestDialog(id) {

    let testOverlay = document.getElementById("testOverlay");
    let title = document.getElementById("testOverlayTitle");
    let questionButton = document.getElementById("questionButton");
    let actionButton = document.getElementById("actionButton");

    displayTestInfo(id);

    questionButton.style.display = (id == null ? "none" : "block");
    actionButton.innerText = (id == null ? "Create" : "Update");
    if(id != null){
        actionButton.onclick = function(){
            updateTest(id);
        }
    }else{
        actionButton.onclick = function(){
            createTest();
        }
    }
    title.innerText = (id == null ? "Create test" : "Update test");
    testOverlay.style.display = "block";
}

async function displayTestInfo(id){
    
    let testNameField = document.getElementById("testNameField");
    let testDurationField = document.getElementById("testDurationField");
    let questionCountField = document.getElementById("questionCountField");
    let startAtField = document.getElementById("startAtField");
    let endAtField = document.getElementById("endAtField");
    
    testNameField.value = null;
    testDurationField.value = null;
    questionCountField.value = null;
    startAtField.value = null;
    endAtField.value = null;

    if(id == null){
        return;
    }

    let testResponse = await apiHandler(APIController.getTest, id);

    if(testResponse == undefined){
        return;
    }

    if(testResponse.statusCode != undefined){
        switch(testResponse.statusCode){
            default:
                console.log(testResponse);
        }
        return;
    }

    testNameField.value = testResponse.testName;
    testDurationField.value = testResponse.duration / 60;
    questionCountField.value = testResponse.questionCount;
    startAtField.value = new Date(testResponse.startAt).toISOString().slice(0, 16);
    endAtField.value = new Date(testResponse.endAt).toISOString().slice(0, 16);

}

async function updateTest(id) {
    
    let testNameField = document.getElementById("testNameField");
    let testDurationField = document.getElementById("testDurationField");
    let questionCountField = document.getElementById("questionCountField");
    let startAtField = document.getElementById("startAtField");
    let endAtField = document.getElementById("endAtField");
    
    let testDuration = Number.parseInt(testDurationField.value);
    let questionCount = Number.parseInt(questionCountField.value);
    
    if(!verifyTestData(testNameField.value, testDuration, questionCount, startAtField.value, endAtField.value)){
        return;
    }

    let testData = {
        professorId: Number.parseInt(identity.id),
        testName: testNameField.value,
        duration: testDuration * 60,
        questionCount: questionCount,
        startAt: startAtField.value,
        endAt: endAtField.value
    }

    let updateResponse = await apiHandler(APIController.updateTest, id, testData);

    if (updateResponse.statusCode != undefined) {

        switch (updateResponse.statusCode) {
            case 401:
                logout();
                break;
            case 0:
                displayTests();
                hideTestDialog();
                break;
            default:
                console.log(updateResponse);
        }

        return;
    }

}

async function createTest(){

    let testNameField = document.getElementById("testNameField");
    let testDurationField = document.getElementById("testDurationField");
    let questionCountField = document.getElementById("questionCountField");
    let startAtField = document.getElementById("startAtField");
    let endAtField = document.getElementById("endAtField");
    
    let testDuration = Number.parseInt(testDurationField.value);
    let questionCount = Number.parseInt(questionCountField.value);
    
    if(!verifyTestData(testNameField.value, testDuration, questionCount, startAtField.value, endAtField.value)){
        return;
    }

    let testData = {
        professorId: Number.parseInt(identity.id),
        testName: testNameField.value,
        duration: testDuration * 60,
        questionCount: questionCount,
        startAt: startAtField.value,
        endAt: endAtField.value
    }

    updateResponse = await apiHandler(APIController.createTest, testData);

    if (updateResponse.statusCode != undefined) {

        switch (updateResponse.statusCode) {
            case 401:
                logout();
                break;
            default:
                console.log(updateResponse);
        }

        return;
    }

    displayTests();
    hideTestDialog();

}

function verifyTestData(testName, testDuration, questionCount, startAt, endAt) {

    let messages = [];
    if (testName.length == 0) {
        messages.push("Test name is not valid");
    }

    if (!startAt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/g)) {
        messages.push("Start date not valid");
    }

    if (!endAt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/g)) {
        messages.push("End date not valid");
    }

    if (isNaN(testDuration) || testDuration < 0) {
        messages.push("Test duration must be greater or equal to 0");
    }

    if (isNaN(questionCount) || questionCount < 0) {
        messages.push("Question count must be greater or equal to 0");
    }

    if (messages.length > 0) {
        console.log(messages);
        return false;
    }

    return true;
}

function viewResults(testId, testName){
    let resultTestInfo = {
        professorId: identity.id,
        testId: testId,
        testName: testName
    }

    sessionStorage.setItem("resultTestInfo", JSON.stringify(resultTestInfo));
    window.location = "professorResults.html";
}

async function deleteTest(testId) {
    let data = {
        testId: Number.parseInt(testId)
    };

    let deleteResponse = await apiHandler(APIController.deleteTest, data);

    if(deleteResponse == undefined){
        return;
    }

    if(deleteResponse.statusCode != undefined){
        switch(deleteResponse.statusCode){
            case 401:
                logout();
                break;
            case 0:
                displayTests();
                break;
            default:
                console.log(deleteResponse.statusCode);
        }
        return;
    }

}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location = "professorLogin.html";
}