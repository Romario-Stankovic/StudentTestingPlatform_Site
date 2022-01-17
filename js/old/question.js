
function addAnswers(){
    
    let container = document.getElementById("answerList");
    
    for(let i=0; i<5; i++){
        addAnswer(container, i, `Answer: ${i}`, false);
    }
}

$(document).ready(function(){
    addAnswers();
});

function submit(){
    let answers = document.getElementsByName("answer");
    for(let i =0; i<answers.length; i++){
        console.log(answers[i].id + " - " + answers[i].checked);
    }
}