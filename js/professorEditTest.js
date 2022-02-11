let editTestInfo;

class Answer {
    answerId;
    answerText;
    imagePath;
    isCorrect;
    toDelete;

    constructor(answerId, answerText, imagePath, isCorrect, toDelete){
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

    constructor(questionId, questionText, imagePath, toDelete){
        this.questionId = questionId;
        this.questionText = questionText;
        this.imagePath = imagePath;
        this.toDelete = toDelete;
    }

}

let questions = [];

$(async function(){
    editTestInfo = JSON.parse(sessionStorage.getItem("editTestInfo"));
    displayTestInfo();
    await getQuestions();
    displayQuestions();
})

function displayTestInfo(){
    let testBrief = document.getElementById("testBrief");
    testBrief.innerText = editTestInfo.testName;
}

async function saveQuestions(event){
    event.preventDefault();

    let data = {
        testId: Number.parseInt(editTestInfo.testId),
        questions: questions
    }

    let saveResponse = await apiHandler(APIController.updateTestQuestions, data);

    if(saveResponse == undefined){
        return;
    }

    if(saveResponse.statusCode != undefined){
        switch(saveResponse.statusCode){
            case 0:
                window.location.reload();
                break;
            default:
                console.log(saveResponse);
        }
        return;
    }

}

function goToProfessorMain(event){
    event.preventDefault();
    window.location = "professorMain.html";
}

async function getQuestions(){
    let questionsResponse = await apiHandler(APIController.getTestQuestions, editTestInfo.testId);

    if(questionsResponse == undefined){
        return;
    }

    if(questionsResponse.statusCode != undefined){
        switch(questionsResponse.statusCode){
            default:
                console.log(questionsResponse);
        }
        return;
    }

    for(let question of questionsResponse){
        let lastIndex = questions.push(new Question(question.questionId, question.questionText, question.imagePath, false)) - 1;
        for(let answer of question.answers){
            questions[lastIndex].answers.push(new Answer(answer.answerId, answer.answerText, answer.imagePath, answer.isCorrect == 1 ? true : false, false));
        }
    }

}

function displayQuestions(){

    let questionList = document.getElementById("questionList");

    clearContainer(questionList);

    for(let i=questions.length-1; i>=0; i--){
        let answerHTML = Element
        answerHTML.innerHTML = "";
        for(let j = 0; j < questions[i].answers.length; j++){
            if(questions[i].answers[j].toDelete == true){
                continue;
            }
            addEditableAnswer(answerHTML, i, j, questions[i].answers[j].answerText, questions[i].answers[j].isCorrect);
        }
        if(questions[i].toDelete == true){
            continue;
        }
        addEditableQuestion(questionList, i, questions[i].imagePath, questions[i].questionText, answerHTML.innerHTML);
    }
}

function resizeTextArea(textarea){
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function addQuestion(){
    let question = new Question(null, "", null, false);
    questions.push(question);
    displayQuestions();
}

function addAnswer(event, questionIndex){
    event.preventDefault();
    let answer = new Answer(null, "", null, false, false);
    questions[questionIndex].answers.push(answer);
    displayQuestions();
}

function deleteQuestion(index){
    if(questions[index].questionId != null){
        questions[index].toDelete = true;
    }else{
        questions.splice(index, 1);
    }
    displayQuestions();
}

function deleteAnswer(questionIndex, answerIndex){
    if(questions[questionIndex].answers[answerIndex].answerId != null){
        questions[questionIndex].answers[answerIndex].toDelete = true;
    }else{
        questions[questionIndex].answers.splice(answerIndex, 1);
    }
    displayQuestions();
}

function updateQustionText(index, textarea){
    questions[index].questionText = textarea.value;
}

function updateAnswerText(questionIndex, answerIndex, textarea){
    questions[questionIndex].answers[answerIndex].answerText = textarea.value;
}

function updateAnswerCheckbox(questionIndex, answerIndex, checkbox){
    questions[questionIndex].answers[answerIndex].isCorrect = checkbox.checked;
}