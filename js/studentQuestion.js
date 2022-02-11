let workInfo = null;

$(async function () {

    workInfo = JSON.parse(sessionStorage.getItem("workInfo"));

    dispalyTestName();
    updateTimer();

    setInterval(updateTimer, 1000);

    await displayQuestion();
})

function dispalyTestName() {
    let questionTestNameField = document.getElementById("questionTestNameField");
    questionTestNameField.innerText = workInfo.testName;
}

function updateTimer() {

    workInfo.questionDuration += 1;
    let questionTimer = document.getElementById("questionTimer");

    let endsAt = new Date(workInfo.endsAt);
    let current = new Date();
    let secondsLeft = clamp((endsAt.getTime() - current.getTime()) / 1000, 0, 86400);

    if (secondsLeft == 0) {
        finishWork();
    }

    questionTimer.innerText = new Date(secondsLeft * 1000).toISOString().substring(14, 19);
    sessionStorage.setItem("workInfo", JSON.stringify(workInfo));
}

async function displayQuestion() {

    let questionId = workInfo.questions[workInfo.currentQuestion];

    let questionResponse = await apiHandler(APIController.getWorkQuestion, workInfo.workId, questionId);

    if (questionResponse == undefined) {
        return;
    }

    if (questionResponse.statusCode != undefined) {
        switch (questionResponse.statusCode) {
            case 3002:
                window.location = "studentResult.html";
                break;
            default:
                console.log(questionResponse);
        }
    }

    let questionNumber = document.getElementById("questionNumber");
    let questionText = document.getElementById("questionText");
    let questionImage = document.getElementById("questionImage");
    let answerList = document.getElementById("answerList");

    let nextQuestionButton = document.getElementById("nextQuestionButton");

    if (workInfo.currentQuestion == workInfo.questions.length - 1) {
        nextQuestionButton.innerText = "Finish";
        nextQuestionButton.classList.add("redButton");
        nextQuestionButton.onclick = function (event) {
            finishWork();
        };
    }

    questionNumber.innerText = "Question: " + (workInfo.currentQuestion + 1) + "/" + workInfo.questions.length;

    questionText.innerText = questionResponse.questionText;

    questionImage.src = questionResponse.imagePath != null ? apiPhotoUrl + questionResponse.imagePath : "img/noquestionimage.png";

    if (questionResponse.imagePath == null) {
        let questionPanel = document.getElementById("questionPanel");
        questionPanel.classList.add("questionNoImage");
    }

    for (let answer of questionResponse.answers) {
        addAnswer(answerList, answer.answerId, answer.answerText, questionResponse.multichoice, answer.isChecked);
    }

    workInfo.questionDuration = questionResponse.duration;

}

async function nextQuestion() {

    let max = workInfo.questions.length - 1;

    if (workInfo.currentQuestion < max) {
        workInfo.currentQuestion += 1;
    } else {
        return;
    }

    let uploadResponse = await uploadAnswers();

    if (uploadResponse == true) {
        sessionStorage.setItem("workInfo", JSON.stringify(workInfo));
        window.location.reload();
    } else {
        window.location = "studentResult.html";
    }

}

async function previousQuestion() {

    if (workInfo.currentQuestion > 0) {
        workInfo.currentQuestion -= 1;
    } else {
        return;
    }

    let uploadResponse = await uploadAnswers();

    if (uploadResponse == true) {
        sessionStorage.setItem("workInfo", JSON.stringify(workInfo));
        window.location.reload();
    } else {
        window.location = "studentResult.html";
    }

}

async function finishWork() {

    await uploadAnswers();

    let data = {
        workId: workInfo.workId
    }

    let finishResponse = await apiHandler(APIController.finishWork, data);

    if (finishResponse.statusCode != undefined) {
        switch (finishResponse.statusCode) {
            default:
                console.log(finishResponse);
        }
    }

    window.location = "studentResult.html";
}

async function uploadAnswers() {

    let answers = document.getElementsByName("answer");

    let data = {
        workId: workInfo.workId,
        duration: workInfo.questionDuration,
        answers: []
    }

    for (let answer of answers) {
        data.answers.push({ id: answer.id, isChecked: answer.checked });
    }

    let updateResponse = await apiHandler(APIController.updateWorkAnswers, data);

    if (updateResponse.statusCode != undefined) {
        switch (updateResponse.statusCode) {
            case 0:
                return new Promise(resolve => { resolve(true) });
            case 3002:
                return new Promise(resolve => { resolve(false) });
            default:
                console.log(updateResponse);
        }
    }

}