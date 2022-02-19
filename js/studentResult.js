$(async function(){
    displayResult();
})

async function displayResult(){
    let workInfo = JSON.parse(sessionStorage.getItem("workInfo"));

    
    
    let icon = document.getElementById("resultIcon");
    
    let messageText = document.getElementById("messageText");
    let statusText = document.getElementById("statusText");
    
    let scoreText  = document.getElementById("scoreText");
    
    let workResponse = await apiHandler(APIController.getWork, "default", workInfo.workId);
    let points = workResponse.points;

    if(workResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(workResponse.statusCode != undefined){
        switch(workResponse.statusCode){
            case 400:
                alert(workResponse.message);
                break;
            case 401:
                studentLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                window.location = "studentMain.html";
                break;
        }
        return;
    }

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