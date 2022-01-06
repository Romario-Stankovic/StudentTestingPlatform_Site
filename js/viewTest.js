let urlParams = new URLSearchParams(window.location.search);
let studentIndex = urlParams.get("index");

function goBack() {
    document.location = "studentProfile.html?index=" + studentIndex;
}

function expandContent(button) {
    let content = button.parentElement.querySelector(".content");
    // Is the content expanded when we press the button?
    let expanded = (content.style.display == "block" ? true : false);
    // If it is collapse the content
    content.style.display = (expanded ? "none" : "block");
    // If we collapsed the content, set the message on hte button to expand
    button.innerText = expanded ? "Expand" : "Collapse";
}

function displayResult(){
    let container = document.getElementById("questionList");
    clearContainer(container);
    let answersHTML = Element
    answersHTML.innerHTML = "";
    addResultAnswer(answersHTML, 0, "Answer 1", false, true, true);
    addResultAnswer(answersHTML, 1, "Answer 2", false, false, false);
    addResultAnswer(answersHTML, 2, "Answer 3", false, false, false);
    addResultAnswer(answersHTML, 3, "Answer 4", false, false, false);
    addQuestionResult(container, 0, null, "test", false, answersHTML.innerHTML);
}

$(document).ready(function(){
    displayResult();
});