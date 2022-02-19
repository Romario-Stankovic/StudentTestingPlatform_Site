let identity;

$(async function(){
    hideTestDialog();

    await displayProfessorInfo();
    await displayTests();
})

async function displayProfessorInfo() {
    let professorBrief = document.getElementById("professorBrief");

    let identityResponse = await apiHandler(APIController.getIdentity);

    if(identityResponse == undefined){
        alert("Could not contact API");
        professorLogout();
        return;
    }

    if (identityResponse.statusCode != undefined) {
        switch (identityResponse.statusCode) {
            case 401:
                professorLogout();
                break;
            case 4001:
                professorLogout();
                break;
            default:
                console.log(identityResponse);
        }
        return;
    }

    if (identityResponse.role != "professor") {
        professorLogout();
    }

    identity = identityResponse;

    professorBrief.innerText = identity.firstName + " " + identity.lastName;

}

async function displayTests() {

    let testList = document.getElementById("testList");

    let testsResponse = await apiHandler(APIController.getTest, "professor", identity.id);

    if(testResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if (testsResponse.statusCode != undefined) {
        switch (testsResponse.statusCode) {
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                testList.innerText = "No tests";
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

function showTestDialog(id, testName) {

    let testOverlay = document.getElementById("testOverlay");
    let title = document.getElementById("testOverlayTitle");
    let questionButton = document.getElementById("questionButton");
    let actionButton = document.getElementById("actionButton");

    loadTest(id);

    questionButton.style.display = (id == null ? "none" : "block");

    actionButton.innerText = (id == null ? "Create" : "Save");
    if(id != null){
        actionButton.onclick = function(){
            updateTest(id);
        }
    }else{
        actionButton.onclick = function(){
            createTest();
        }
    }

    questionButton.onclick = function(){
        goToEditTest(id, testName);
    }

    title.innerText = (id == null ? "Create test" : "Update test");
    testOverlay.style.display = "block";
}

async function loadTest(id) {
    
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

    let testResponse = await apiHandler(APIController.getTest, "default", id);

    if(testResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(testResponse.statusCode != undefined){
        switch(testResponse.statusCode){
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                alert("Cannot load data");
                break;
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
        testId: Number.parseInt(id),
        professorId: Number.parseInt(identity.id),
        testName: testNameField.value,
        duration: testDuration * 60,
        questionCount: questionCount,
        startAt: startAtField.value,
        endAt: endAtField.value
    }

    let updateResponse = await apiHandler(APIController.updateTest, testData);

    if(updateResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if (updateResponse.statusCode != undefined) {

        switch (updateResponse.statusCode) {
            case 0:
                displayTests();
                hideTestDialog();
                break;
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1001:
                alert("Update failed");
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

    let createResponse = await apiHandler(APIController.createTest, testData);

    if(createResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if (createResponse.statusCode != undefined) {

        switch (createResponse.statusCode) {
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1001:
                alert("Saving failed");
                break;
            default:
                console.log(createResponse);
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
        alert("Could not contact API");
        return;
    }

    if(deleteResponse.statusCode != undefined){
        switch(deleteResponse.statusCode){
            case 0:
                displayTests();
                break;
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1002:
                alert("Failed to delete");
                break;
            default:
                console.log(deleteResponse);
        }
        return;
    }

}

function goToEditTest(testId, testName){
    editTestInfo = {
        testId : testId,
        testName : testName
    }

    sessionStorage.setItem("editTestInfo", JSON.stringify(editTestInfo));

    window.location = "professorEditTest.html";
}