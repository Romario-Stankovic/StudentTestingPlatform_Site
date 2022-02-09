$(async function(){
    displayResult();
})

async function displayResult(){
    let workInfo = JSON.parse(sessionStorage.getItem("workInfo"));

    let work = await apiHandler(APIController.getWork, workInfo.workId);

    let points = work.points;

    let icon = document.getElementById("resultIcon");

    let messageText = document.getElementById("messageText");
    let statusText = document.getElementById("statusText");

    let scoreText  = document.getElementById("scoreText");

    if(points < 50){
        icon.dataset.icon = "ant-design:close-circle-outlined";
        icon.classList.add("fail");
        messageText.innerText = "Sorry!";
        statusText.innerText = "You have failed";
    }else{
        icon.dataset.icon = "ant-design:check-circle-outlined";
        icon.classList.add("pass");
        messageText.innerText = "Congratulations!";
        statusText.innerText = "You have passed";
    }

    scoreText.innerText = points + "/100";
}

function goToStudentMain(event){
    event.preventDefault();
    sessionStorage.removeItem("work");
    window.location = "studentMain.html";
}