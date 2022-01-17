function clearContainer(container){
    container.innerHTML = "";
}

function addActiveTest(container, testID, testName){
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="greenButton" onclick="startTest(${testID});">Start</button>
    </div>
    `;
    container.innerHTML += html;
}

function addEditableTest(container, testID, testName){
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="blueButton" onclick="startTest(${testID});">Results</button>
        <button class="blueButton" onclick="startTest(${testID});">Edit</button>
    </div>
    `;
    container.innerHTML += html;
}

function addFinishedTest(container, testID, testName, score){
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <p class="score">${score}%</p>
        <button class="blueButton" onclick="viewTest(${testID});">View</button>
    </div>
    `;
    container.innerHTML += html;
}

function addQuestionResult(container, questionNo, image, text, isCorrect, answerHTML){
    
    let icon = isCorrect ==true ? "ant-design:check-outlined" : "ant-design:close-outlined";
    
    let imageStatus = image == null ? "questionNoImage" : "";

    let iconStatus = isCorrect == true ? "correctIcon" : "wrongIcon";

    let imageUrl = image == null ? "" : image;

    let html = `
    <div class="panel viewQuestion">
        <div class="info">
            <span class="iconify ${iconStatus}" data-icon="${icon}"></span>
            <p>Question: ${questionNo}</p>  
            <button class="blueButton" onclick="expandContent(this);">Expand</button>
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

function addAnswer(container, answerID, answerText, multichoice){
    
    let type = multichoice == true ? "checkbox" : "radio";
    
    let html = `
    <div class="panel answer">
        <p>${answerText}</p>
        <input class="input" id="${answerID}" type="${type}" name="answer">
        <label for="${answerID}"></label>
    </div>
    `;

    container.innerHTML += html;
}

function addResultAnswer(container, answerID, answerText, multichoice, isCorrect, isSelected) {
    
    let answerStatus = isCorrect == true ? "correctAnswer" : "wrongAnswer";
    
    let iconStatus = isCorrect == true ? "correctIcon" : "wrongIcon";

    let icon = isCorrect == true ? "ant-design:check-outlined" : "ant-design:close-outlined";

    let type = multichoice == true ? "checkbox" : "radio";

    let checked = isSelected == true ? "checked" : "";

    let html = `
    <div class="panel answer ${answerStatus}">
        <span class="iconify ${iconStatus}" data-icon="${icon}"></span>
        <p>${answerText}</p>
        <input class="input" id="${answerID}" type="${type}" name="answer" disabled ${checked}>
    </div>
    `;

    container.innerHTML += html;
}