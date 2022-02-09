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

    static getTest(id){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/test/" + "?id=" + id,
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

    static updateTest(id, data){
        return new Promise((resolve) => {
            $.ajax({
                url: apiUrl + "api/test/?id=" + id,
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

    static deleteTest(data){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/test/",
                method: "DELETE",
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

    static getStudentResults(testId){
        return new Promise(resolve => {
            $.ajax({
                url: apiUrl + "api/work/test/?testId=" + testId,
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

}

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

/* Templates */

function clearContainer(container) {
    container.innerHTML = "";
}

function addActiveTest(container, testID, testName) {
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="greenButton" onclick="startTest('${testID}');">Start</button>
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
        <button class="blueButton" onclick="viewWork('${workId}', '${testName}');">View</button>
    </div>
    `;
    container.innerHTML += html;
}

function addFinishedQuestion(container, questionNo, image, text, questionState, answerHTML){
        
    let icons = [
        "ant-design:close-outlined",
        "ant-design:check-outlined",
        "radix-icons:slash"
    ]

    let colors = [
        "#d71920", //RED
        "#3acc07", //GREEN
        "#197cd7" //BLUE
    ]

    let icon = icons[questionState];
    let color = colors[questionState];

    let imageStatus = image == null ? "questionNoImage" : "";

    let imageUrl = image != null ? apiPhotoUrl + image : "img/noquestionimage.png";

    let html = `
    <div class="panel viewQuestion">
        <div class="info">
            <span class="iconify" data-icon="${icon}" style="color: ${color}"></span>
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

function addFinishedAnswer(container, questionNo, answerText, multichoice, isCorrect, isChecked) {

    let icon = isCorrect == true ? "ant-design:check-outlined" : "ant-design:close-outlined";

    let type = multichoice == true ? "checkbox" : "radio";

    let checked = isChecked == true ? "checked" : "";

    let color = isCorrect == true ? "#3acc07" : "#d71920";

    let html = `
    <div class="panel answer" style="border: 2px solid ${color}">
        <span class="iconify" data-icon="${icon}" style="color: ${color}"></span>
        <p>${answerText}</p>
        <input class="input" type="${type}" name="answer_${questionNo}" disabled ${checked}>
    </div>
    `;

    container.innerHTML += html;
}

function addEditableTest(container, testID, testName) {
    let html = `
    <div class="listItem">
        <p>${testName}</p>
        <button class="blueButton" onclick="viewResults('${testID}', '${testName}');">Results</button>
        <button class="blueButton" onclick="showTestDialog('${testID}');">Edit</button>
        <button class="redButton" onclick="deleteTest('${testID}');">Delete</button>
    </div>
    `;
    container.innerHTML += html;
}

function addStudentResult(container, workId, testName, studentIndex, score){
    let html = `
    <div class="listItem">
        <p>${studentIndex}</p>
        <p class="score">${score}%</p>
        <button class="blueButton" onclick="viewWork('${workId}', '${testName}');">View</button>
    </div>
    `;
    container.innerHTML += html;
}