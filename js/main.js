const apiUrl = "http://localhost:4000/";
const apiPhotoUrl = apiUrl + "assets/images/";

class APIController {

    static getIdentity() {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "auth/token/identity",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static refreshToken() {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "auth/token/refresh",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    refreshToken: localStorage.getItem("refreshToken")
                })
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static login(userType, loginData) {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "auth/login/" + userType,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(loginData)
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            });
        })
    }

    static getActiveTests() {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/test/active",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static startWork(data) {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/start/",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify(data)
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static getWorkQuestion(workId, questionId) {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/question/?workId=" + workId + "&questionId=" + questionId,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static finishWork(data){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/finish",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify(data)
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static getWork(workId){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/?id=" + workId,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static getFinishedWorks(studentId){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/finished/?studentId=" + studentId,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static getFinishedWorkQuestions(workId){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/question/all/?id=" + workId,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static getProfessorTests(id) {
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/test/professor" + "?id=" + id,
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static createTest(data) {
        return new Promise((resolve) => {
            $.ajax({
                url: apiUrl + "api/test/",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify(data)
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

    static updateAnswers(data){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/question/",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: JSON.stringify(data)
            }).done(data => {
                resolve(data);
            }).catch(error => {
                resolve(error.responseJSON);
            })
        })
    }

}

let identity;

async function apiHandler(callback, ...params) {

    async function refreshToken() {
        let refreshResponse = await APIController.refreshToken();
        if (refreshResponse == undefined || refreshResponse.statusCode != undefined) {
            return new Promise(resolve => { resolve(false) });
        }
        localStorage.setItem("token", refreshResponse.token);
        localStorage.setItem("refreshToken", refreshResponse.refreshToken);
        return new Promise(resolve => { resolve(true) });
    }

    let response = await callback(...params);
    if (response == undefined || (response.statusCode != undefined && response.statusCode == 401)) {
        if (await refreshToken()) {
            response = await callback(...params);
        }
    }
    return response;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/* Login Page */

function loginPageLoaded() {
    let loginError = document.getElementById("loginError");
    loginError.style.display = "none";
}

async function studentLogin(event) {
    event.preventDefault();

    let indexNumber = document.getElementById("indexField").value;
    let loginError = document.getElementById("loginError");

    let login = await apiHandler(APIController.login, "student", { indexNumber: indexNumber });

    if (login.statusCode != undefined) {

        switch (login.statusCode) {
            case 400:
                loginError.style.display = "block";
                loginError.innerText = "Index number is in the wrong format";
                break;
            case 4001:
                loginError.style.display = "block";
                loginError.innerText = "Bad index number";
                break;
            default:
                console.log(login);
        }

        return;
    }

    localStorage.setItem("token", login.token);
    localStorage.setItem("refreshToken", login.refreshToken);
    window.location = "studentMain.html";

}

async function professorLogin(event) {
    event.preventDefault();

    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;

    let loginError = document.getElementById("loginError");

    let login = await apiHandler(APIController.login,"professor", { username: username, password: password });

    if (login.statusCode != undefined) {

        switch (login.statusCode) {
            case 400:
                loginError.style.display = "block";
                loginError.innerText = "Wrong format!";
                break;
            case 4001:
                loginError.style.display = "block";
                loginError.innerText = "User does not exist";
                break;
            case 4002:
                loginError.style.display = "block";
                loginError.innerText = "Password incorrect!";
                break;
            default:
                console.log(login);
        }

        return;
    }

    localStorage.setItem("token", login.token);
    localStorage.setItem("refreshToken", login.refreshToken);
    window.location = "professorMain.html";
}

/* Student Main Page */

async function studentMainPageLoaded() {

    await displayMainStudentInfo();

    await displayActiveTests();

}

async function displayMainStudentInfo() {
    let studentBrief = document.getElementById("studentBrief");

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

    studentBrief.innerText = identity.firstName + " " + identity.lastName + " - " + identity.indexNumber;

}

function studentLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location = "studentLogin.html";
}

async function displayActiveTests() {

    let testList = document.getElementById("testList");
    clearContainer(testList);

    let tests = await apiHandler(APIController.getActiveTests);

    if (tests == undefined) {
        return;
    }

    if (tests.statusCode != undefined) {
        switch (test.statusCode) {
            case 401:
                studentLogout();
                break;
            default:
                console.log(tests);
        }
        return;
    }

    for (let test of tests) {
        addActiveTest(testList, test.testId, test.testName);
    }

}

async function startTest(testId) {
    data = {
        studentId: identity.id,
        testId: testId
    }

    let work = await apiHandler(APIController.startWork, data);

    if (work.statusCode != undefined) {
        switch (work.statusCode) {
            case 401:
                studentLogout();
                break;
            default:
                console.log(work);
        }
        return;
    }

    let questions = work.questions;

    workInfo = {
        workId : work.workId,
        studentId: identity.id,
        testId: testId,
        testName: work.testName,
        questions: questions,
        activeQuestion: 0,
        questionDuration: 0,
        startedAt: work.startedAt,
        endsAt: work.endsAt
    }

    sessionStorage.removeItem("work");
    sessionStorage.setItem("work", JSON.stringify(workInfo));
    window.location = "studentQuestion.html";
}

function goToStudentProfile(event) {
    event.preventDefault();
    window.location = "studentProfile.html";
}

/* Student profile */

async function studentProfilePageLoaded() {
    await displayProfileStudentInfo();

    await displayFinishedWorks();
}

async function displayProfileStudentInfo() {
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
    studentProfilePicture.src = apiPhotoUrl + identity.imagePath;

}

async function displayFinishedWorks(){
    let works = await apiHandler(APIController.getFinishedWorks, identity.id);
    let testList = document.getElementById("testList");
    for (let work of works){
        addFinishedTest(testList, work.workId, work.testName, work.points);
    }
}

function goToMain(event) {
    event.preventDefault();
    window.location = "studentMain.html";
}

function viewTestResults(workId, testName) {
    sessionStorage.setItem("workResultId", workId);
    sessionStorage.setItem("workTestName", testName);
    window.location = "studentViewTest.html";
}

/* Student Question Page */

async function questionPageLoaded(){
    
    displayWorkInfo();
    displayRemainingTime();

    setInterval(displayRemainingTime, 1000);

    await displayQuestion();
}

function displayWorkInfo(){
    let workInfo = JSON.parse(sessionStorage.getItem("work"));

    questionTestNameField.innerText = workInfo.testName;

}

function displayRemainingTime(){
    let workInfo = JSON.parse(sessionStorage.getItem("work"));
    workInfo.questionDuration += 1;
    let questionTimer = document.getElementById("questionTimer");

    endsAt = new Date(workInfo.endsAt);
    current = new Date();
    let secondsLeft = clamp( (endsAt.getTime() - current.getTime())/1000, 0, 86400);
    if(secondsLeft == 0){
        updateAnswers().then(data => {
            finishWork();
        });
    }
    questionTimer.innerText = new Date(secondsLeft * 1000).toISOString().substring(14, 19);
    sessionStorage.setItem("work", JSON.stringify(workInfo));
}

async function displayQuestion(){
    let workInfo = JSON.parse(sessionStorage.getItem("work"));
    let questionIndex = workInfo.activeQuestion;

    let question = await apiHandler(APIController.getWorkQuestion, workInfo.workId, workInfo.questions[questionIndex]);
    if(question.statusCode != undefined){
        switch(question.statusCode){
            case 3002:
                window.location = "studentResult.html";
                break;
            default:
                console.log(question);
        }
    }

    let questionNumber = document.getElementById("questionNumber");
    let questionText = document.getElementById("questionText");
    let questionImage = document.getElementById("questionImage");
    let answerList = document.getElementById("answerList");

    let nextQuestionButton = document.getElementById("nextQuestionButton");

    if(questionIndex == workInfo.questions.length-1){
        nextQuestionButton.innerText = "Finish";
        nextQuestionButton.classList.add("redButton");
        nextQuestionButton.onclick = function(event){
            updateAnswers().then(data => {
                finishWork();
            });
        };
    }

    questionNumber.innerText = "Question: " + (workInfo.activeQuestion + 1) + "/" + workInfo.questions.length;
    questionText.innerText = question.questionText;

    if(question.imagePath != null){
        questionImage.src = apiPhotoUrl + question.imagePath;
    }

    if(question.imagePath == null){
        let questionPanel = document.getElementById("questionPanel");
        questionPanel.classList.add("questionNoImage");
    }

    for(let answer of question.answers) {
        addAnswer(answerList, answer.answerId, answer.answerText, question.multichoice, answer.isChecked);
    }
    
    workInfo.questionDuration = question.duration;
    sessionStorage.setItem("work", JSON.stringify(workInfo));

}

function nextQuestion(){

    let workInfo = JSON.parse(sessionStorage.getItem("work"));
    let max = workInfo.questions.length - 1;

    if(workInfo.activeQuestion < max){
        workInfo.activeQuestion += 1;
    }else{
        return;
    }

    updateAnswers().then(data => {
        if(data == true){
            sessionStorage.setItem("work", JSON.stringify(workInfo));
            window.location.reload();
        }else{
            window.location = "studentResult.html";
        }
    });
}

function previousQuestion(){
    let workInfo = JSON.parse(sessionStorage.getItem("work"));

    if(workInfo.activeQuestion > 0){
        workInfo.activeQuestion -= 1;
    }else{
        return;
    }

    updateAnswers().then(data => {
        if(data == true){
            sessionStorage.setItem("work", JSON.stringify(workInfo));
            window.location.reload();
        }else{
            window.location = "studentResult.html";
        }
    });

}

async function updateAnswers(){
    
    let workInfo = JSON.parse(sessionStorage.getItem("work"));

    let answers = document.getElementsByName("answer");

    data = {
        workId: workInfo.workId,
        duration: workInfo.questionDuration,
        answers: []
    }

    for(let answer of answers){
        data.answers.push({id: answer.id, isChecked: answer.checked});
    }
    
    let updateResponse = await apiHandler(APIController.updateAnswers, data);
    if(updateResponse.statusCode != undefined){
        switch(updateResponse.statusCode){
            case 0:
                return new Promise(resolve => {resolve(true)});
            case 3002:
                return new Promise(resolve => {resolve(false)});
            default:
                console.log(updateResponse);
        }
    }

}

async function finishWork() {
    let workInfo = JSON.parse(sessionStorage.getItem("work"));
    data = {
        workId: workInfo.workId
    }

    let response = await apiHandler(APIController.finishWork, data);
    if(response.statusCode != undefined){
        switch (response.statusCode){
            default:
                console.log(response);
        }
    }

    window.location = "studentResult.html";
}

/* Result page */

async function resultPageLoaded(){

    let workInfo = JSON.parse(sessionStorage.getItem("work"));

    let work = await apiHandler(APIController.getWork, workInfo.workId);

    let points = work.points;

    let passedIcon = document.getElementById("passedIcon");
    let failedIcon = document.getElementById("failedIcon");

    let messageText = document.getElementById("messageText");
    let statusText = document.getElementById("statusText");

    let scoreText  = document.getElementById("scoreText");

    if(points < 50){
        passedIcon.style.display = "none";
        messageText.innerText = "Sorry!";
        statusText.innerText = "You have failed";
    }else{
        failedIcon.style.display = "none";
        messageText.innerText = "Congratulations!";
        statusText.innerText = "You have passed";
    }

    scoreText.innerText = points + "/100";
}

/* View Test Page */
async function viewTestPageLoaded(){
    await displayFinishedQuestions();
}

async function displayFinishedQuestions(){
    let workId = sessionStorage.getItem("workResultId");
    let testName = sessionStorage.getItem("workTestName");
    let questionList = document.getElementById("questionList");
    let testBrief = document.getElementById("testBrief");
    let questions = await apiHandler(APIController.getFinishedWorkQuestions, workId);
    testBrief.innerText = testName;

    for(let i = 0; i<questions.length; i++){
        console.log(questions[i]);
        let answers = Element
        answers.innerHTML = "";
        let isCorrect = true;
        for(let answer of questions[i].answers){
            if(answer.isChecked && !answer.isCorrect){
                isCorrect = false;
            }
            addFinishedAnswer(answers, i, answer.answerText, questions[i].multichoice, answer.isCorrect, answer.isChecked);
        }
        addFinishedQuestion(questionList, i+1, questions[i].imagePath, questions[i].questionText, isCorrect, answers.innerHTML);
    }

}

function expandQuestion(button){
    let content = button.parentElement.parentElement.querySelector(".content");
    let expanded = (content.style.display == "block" ? true : false);
    content.style.display = (expanded ? "none" : "block");
    button.innerText = expanded ? "Expand" : "Collapse";
}

/* Professor Main */

async function professorMainPageLoaded() {

    hideCreateTestDialog();

    await displayMainProfessorInfo();
    await displayProfessorTests();
}

async function displayMainProfessorInfo() {
    let professorBrief = document.getElementById("professorBrief");

    identity = await apiHandler(APIController.getIdentity);

    if (identity.statusCode != undefined) {
        switch (identity.statusCode) {
            case 401:
                professorLogout();
                break;
            default:
                console.log(identity);
        }
        return;
    }

    if (identity.role != "professor") {
        professorLogout();
    }

    professorBrief.innerText = identity.firstName + " " + identity.lastName;

}

async function displayProfessorTests() {

    let testList = document.getElementById("testList");

    let tests = await apiHandler(APIController.getProfessorTests, identity.id);

    if (tests.statusCode != undefined) {
        switch (tests.statusCode) {
            case 401:
                professorLogout();
                break;
            default:
                console.log(tests);
        }
        return;
    }

    clearContainer(testList);


    for (let test of tests) {
        addEditableTest(testList, test.testId, test.testName);
    }

}

function hideCreateTestDialog() {
    let testOverlay = document.getElementById("testOverlay");
    testOverlay.style.display = "none";
}

function showCreateTestDialog() {
    let testOverlay = document.getElementById("testOverlay");
    testOverlay.style.display = "block";
}

async function createTest() {
    let testNameField = document.getElementById("testNameField");
    let testDurationField = document.getElementById("testDurationField");
    let questionCountField = document.getElementById("questionCountField");
    let startAtField = document.getElementById("startAtField");
    let endAtField = document.getElementById("endAtField");

    let messages = [];
    if (testNameField.value.length == 0) {
        messages.push("Test name is not valid");
    }

    if (!testDurationField.value.match(/^-?\d+$/g)) {
        messages.push("Test duration is not valid");
    }

    if (!questionCountField.value.match(/^-?\d+$/g)) {
        messages.push("Test question count is not valid");
    }

    if (!startAtField.value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/g)) {
        messages.push("Start date not valid");
    }

    if (!endAtField.value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/g)) {
        messages.push("End date not valid");
    }

    let testDuration = Number.parseInt(testDurationField.value);
    if (testDuration <= 0) {
        messages.push("Test duration must be greater or equal to 0");
    }

    let questionCount = Number.parseInt(questionCountField.value);
    if (questionCount <= 0) {
        messages.push("Question count must be greater or equal to 0");
    }

    console.log(messages);

    if (messages.length > 0) {
        return;
    }

    testData = {
        professorId: Number.parseInt(identity.id),
        testName: testNameField.value,
        duration: testDuration * 60,
        questionCount: questionCount,
        startAt: startAtField.value,
        endAt: endAtField.value
    }

    let response = await apiHandler(APIController.createTest, testData);

    if (response.statusCode != undefined) {

        switch (response.statusCode) {
            case 401:
                professorLogout();
                break;
            default:
                console.log(response);
        }

        return;
    }

    displayProfessorTests();
    hideCreateTestDialog();
    console.log(response);

}

function professorLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location = "professorLogin.html";
}

/* HTML Templates */

function clearContainer(container) {
    container.innerHTML = "";
}

function addActiveTest(container, testID, testName) {
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="greenButton" onclick="startTest(${testID});">Start</button>
    </div>
    `;
    container.innerHTML += html;
}

function addEditableTest(container, testID, testName) {
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="blueButton" onclick="startTest(${testID});">Results</button>
        <button class="blueButton" onclick="startTest(${testID});">Edit</button>
    </div>
    `;
    container.innerHTML += html;
}

function addAnswer(container, answerID, answerText, multichoice, isChecked){
    
    let type = multichoice == true ? "checkbox" : "radio";
    let checked = isChecked == true ? "checked" : "";
    let html = `
    <div class="panel answer">
        <p>${answerText}</p>
        <input class="input" id="${answerID}" type="${type}" name="answer" ${checked}>
        <label for="${answerID}"></label>
    </div>
    `;

    container.innerHTML += html;
}

function addFinishedTest(container, workId, testName, score){
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <p class="score">${score}%</p>
        <button class="blueButton" onclick="viewTestResults(${workId}, '${testName}');">View</button>
    </div>
    `;
    container.innerHTML += html;
}

function addFinishedQuestion(container, questionNo, image, text, isCorrect, answerHTML){
    
    let icon = isCorrect ==true ? "ant-design:check-outlined" : "ant-design:close-outlined";
    
    let imageStatus = image == null ? "questionNoImage" : "";

    let iconStatus = isCorrect == true ? "correctIcon" : "wrongIcon";

    let imageUrl = image == null ? "" : apiPhotoUrl + image;

    let html = `
    <div class="panel viewQuestion">
        <div class="info">
            <span class="iconify ${iconStatus}" data-icon="${icon}"></span>
            <p>Question: ${questionNo}</p>  
            <button class="blueButton" onclick="expandQuestion(this);">Expand</button>
        </div>
        <div class="content">
            <div class="panel question ${imageStatus}">
                <img src="${imageUrl}">
                <p class="text">${text}</p>
            </div>
            <div>
                ${answerHTML}
            </div>
        </div>

    </div>
    `;

    container.innerHTML += html;
}

function addFinishedAnswer(container, questionNo, answerText, multichoice, isCorrect, isSelected) {
    
    let answerStatus = isCorrect == true ? "correctAnswer" : "wrongAnswer";
    
    let iconStatus = isCorrect == true ? "correctIcon" : "wrongIcon";

    let icon = isCorrect == true ? "ant-design:check-outlined" : "ant-design:close-outlined";

    let type = multichoice == true ? "checkbox" : "radio";

    let checked = isSelected == true ? "checked" : "";

    let html = `
    <div class="panel answer ${answerStatus}">
        <span class="iconify ${iconStatus}" data-icon="${icon}"></span>
        <p>${answerText}</p>
        <input class="input" type="${type}" name="answer_${questionNo}" disabled ${checked}>
    </div>
    `;

    container.innerHTML += html;
}