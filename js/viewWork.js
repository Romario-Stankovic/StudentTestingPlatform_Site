let resultInfo;

$(async function (){

    resultInfo = JSON.parse(sessionStorage.getItem("resultInfo"));

    displayTestInfo();

    displayFinishedQuestions();
})

function displayTestInfo(){
    let testBrief = document.getElementById("testBrief");
    testBrief.innerText = resultInfo.testName;
}

async function displayFinishedQuestions(){

    let questionList = document.getElementById("questionList");
    
    let questions = await apiHandler(APIController.getWorkQuestions, resultInfo.workId);

    if(questions == undefined){
        alert("Could not contact API");
        return;
    }

    if(questions.statusCode != undefined){
        switch(questions.statusCode){
            case 401:
                if(resultInfo.professorId != undefined){
                    professorLogout();
                }else{
                    studentLogout();
                }
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                alert("Could not find work");
                break;
        }
        return;
    }

    for(let i = 0; i<questions.length; i++){
        let answers = Element;
        answers.innerHTML = "";
        let correctState = 1;

        let correct = 0;
        let incorrect = 0;
        let totalCorrect = 0;

        for(let answer of questions[i].answers){
            
            totalCorrect += (answer.isCorrect ? 1 : 0);

            if(answer.isChecked && !answer.isCorrect){
                incorrect++;
            }else if(answer.isChecked && answer.isCorrect){
                correct++;
            }

            addFinishedAnswer(answers, i, answer.answerText, answer.imagePath, questions[i].multichoice, answer.isCorrect, answer.isChecked);
        }
        
        if(incorrect > 0){
            correctState = 0;
        }

        if(correct == 0) {
            correctState = 0;
        }

        if(correct > 0 && correct < totalCorrect){
            correctState = 2;
        }

        addFinishedQuestion(questionList, i+1, questions[i].imagePath, questions[i].questionText, correctState, answers.innerHTML);
    }

}

function expandQuestion(button){
    let content = button.parentElement.parentElement.querySelector(".content");
    let expanded = (content.style.display == "block" ? true : false);
    content.style.display = (expanded ? "none" : "block");
    button.innerText = expanded ? "Expand" : "Collapse";
}

function goBack(event){
    event.preventDefault();
    if(resultInfo.professorId != undefined){
        window.location = "professorResults.html";
    }else{
        window.location = "studentProfile.html";
    }
}