let editTestInfo;

class Answer {
    answerId;
    answerText;
    imagePath;
    isCorrect;
    toDelete;

    imageFile = null;

    constructor(answerId, answerText, imagePath, isCorrect, toDelete) {
        this.answerId = answerId;
        this.answerText = answerText;
        this.imagePath = imagePath;
        this.isCorrect = isCorrect;
        this.toDelete = toDelete;
    }

}
class Question {
    questionId;
    questionText;
    imagePath;
    toDelete;
    answers = [];

    imageFile = null;

    constructor(questionId, questionText, imagePath, toDelete) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.imagePath = imagePath;
        this.toDelete = toDelete;
    }

}

let questions = [];

$(async function () {
    editTestInfo = JSON.parse(sessionStorage.getItem("editTestInfo"));
    displayTestInfo();
    await getQuestions();
    displayQuestions();
});

function displayTestInfo() {
    let testBrief = document.getElementById("testBrief");
    testBrief.innerText = editTestInfo.testName;
}

async function saveQuestions(event) {
    event.preventDefault();

    for (let question of questions) {

        for (let answer of question.answers) {
            if (answer.answerId != null && answer.imageFile != null) {
                let formData = new FormData();
                formData.append("image", answer.imageFile);
                let uploadResponse = await apiHandler(APIController.uploadAnswerPhoto, answer.answerId, formData);
                answer.imageFile = null;

                if (uploadResponse == undefined) {
                    continue;
                }

                if (uploadResponse.statusCode != undefined) {
                    switch (uploadResponse.statusCode) {
                        case 0:
                            answer.imagePath = null;
                            continue;
                        case 401:
                            professorLogout();
                            break;
                        case 403:
                            alert("Forbidden for question " + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        case 413:
                            alert("Image too large for question " + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        case 415:
                            alert("Image in the wrong format for question" + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        case 1001:
                            alert("Upload failed for question " + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        case 2001:
                            alert("Saving failed for question " + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        case 2003:
                            alert("Saving failed for question" + (question.questionId + 1) + ", answer " + (answer.answerId + 1));
                            break;
                        default:
                            console.log(uploadResponse);
                    }
                }

            }
        }

        if (question.questionId != null && question.imageFile != null) {
            let formData = new FormData();
            formData.append("image", question.imageFile);
            let uploadResponse = await apiHandler(APIController.uploadQuestionPhoto, question.questionId, formData);
            question.imageFile = null;
            if (uploadResponse == undefined) {
                continue;
            }

            if (uploadResponse.statusCode != undefined) {
                switch (uploadResponse.statusCode) {
                    case 0:
                        question.imagePath = null;
                        continue;
                    case 401:
                        professorLogout();
                        break;
                    case 403:
                        alert("Forbidden for question " + (question.questionId + 1));
                        break;
                    case 413:
                        alert("Image too large for question " + (question.questionId + 1));
                        break;
                    case 415:
                        alert("Image in the wrong format for question" + (question.questionId + 1));
                        break;
                    case 1001:
                        alert("Upload failed for question " + (question.questionId + 1));
                        break;
                    case 2001:
                        alert("Saving failed for question " + (question.questionId + 1));
                        break;
                    case 2003:
                        alert("Saving failed for question" + (question.questionId + 1));
                        break;
                    default:
                        console.log(uploadResponse);
                }
            }
        }
    }

    let data = {
        testId: Number.parseInt(editTestInfo.testId),
        questions: questions
    };

    let saveResponse = await apiHandler(APIController.updateTestQuestions, data);

    if (saveResponse == undefined) {
        alert("Could not contact API");
        return;
    }

    if (saveResponse.statusCode != undefined) {
        switch (saveResponse.statusCode) {
            case 0:
                alert("Edit successful");
                window.location.reload();
                break;
            case 400:
                alert(saveResponse.message);
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                alert("Test does not exist");
                break;
            default:
                console.log(saveResponse);
        }
        return;
    }

}

function goToProfessorMain(event) {
    event.preventDefault();
    window.location = "professorMain.html";
}

async function getQuestions() {
    let questionsResponse = await apiHandler(APIController.getTestQuestions, editTestInfo.testId);

    if (questionsResponse == undefined) {
        alert("Could not contact API");
        return;
    }

    if (questionsResponse.statusCode != undefined) {
        switch (questionsResponse.statusCode) {
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                console.log("No Questions");
                break;
            default:
                console.log(questionsResponse);
        }
        return;
    }

    for (let question of questionsResponse) {
        let lastIndex = questions.push(new Question(question.questionId, question.questionText, question.imagePath, false)) - 1;
        for (let answer of question.answers) {
            questions[lastIndex].answers.push(new Answer(answer.answerId, answer.answerText, answer.imagePath, answer.isCorrect == 1 ? true : false, false));
        }
    }

}

function displayQuestions() {

    let questionList = document.getElementById("questionList");

    clearContainer(questionList);

    for (let i = questions.length - 1; i >= 0; i--) {
        let answerHTML = Element;
        answerHTML.innerHTML = "";
        for (let j = 0; j < questions[i].answers.length; j++) {
            if (questions[i].answers[j].toDelete == true) {
                continue;
            }
            addEditableAnswer(answerHTML, i, j, questions[i].answers[j].answerText, questions[i].answers[j].imagePath, questions[i].answers[j].isCorrect);
        }
        if (questions[i].toDelete == true) {
            continue;
        }
        addEditableQuestion(questionList, i, questions[i].imagePath, questions[i].questionText, answerHTML.innerHTML);
    }
}

function resizeTextArea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function addQuestion() {
    let question = new Question(null, "", null, false);
    questions.push(question);
    displayQuestions();
}

function addAnswer(event, questionIndex) {
    event.preventDefault();
    let answer = new Answer(null, "", null, false, false);
    questions[questionIndex].answers.push(answer);
    displayQuestions();
}

function deleteQuestion(index) {
    if (questions[index].questionId != null) {
        questions[index].toDelete = true;
    } else {
        questions.splice(index, 1);
    }
    displayQuestions();
}

function deleteAnswer(questionIndex, answerIndex) {
    if (questions[questionIndex].answers[answerIndex].answerId != null) {
        questions[questionIndex].answers[answerIndex].toDelete = true;
    } else {
        questions[questionIndex].answers.splice(answerIndex, 1);
    }
    displayQuestions();
}

function updateQuestionText(index, textarea) {
    questions[index].questionText = textarea.value;
}

function updateAnswerText(questionIndex, answerIndex, textarea) {
    questions[questionIndex].answers[answerIndex].answerText = textarea.value;
}

function updateAnswerCheckbox(questionIndex, answerIndex, checkbox) {
    questions[questionIndex].answers[answerIndex].isCorrect = checkbox.checked;
}

function showQuestionUploadDialog(button, questionIndex) {
    let fileInput = button.parentElement.querySelector("#uploadInput");
    fileInput.click();
    fileInput.onchange = function (event) {
        questions[questionIndex].imageFile = fileInput.files[0];
        fileInput.value = "";
        button.classList.add("greenButton");
    };
}

function showAnswerUploadDialog(button, questionIndex, answerIndex) {
    let fileInput = button.parentElement.querySelector("#uploadInput");
    fileInput.click();
    fileInput.onchange = function (event) {
        questions[questionIndex].answers[answerIndex].imageFile = fileInput.files[0];
        fileInput.value = "";
        button.classList.add("greenButton");
    };
}