let errorMessage;

function showErrorMessage(message){
    if(message == null){
        errorMessage.style.display = "none";
    }else{
        errorMessage.style.display = "block";
        errorMessage.innerText = message;
    }
}

function studentLogin(event){

    event.preventDefault();

    let indexNumber = document.getElementById("indexField").value;
    $.ajax({
        url: "http://localhost:4000/auth/login/student",
        method: "POST",
        data: {
            indexNumber: indexNumber
        },
        success: function(data) {
                if(data.code == undefined){
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    window.location = "studentTests.html";
                }else if(data.code == 4001){
                    showErrorMessage("Invalid index number!");
                }
        },
        statusCode:
        {
            400: function(){
                showErrorMessage("Index number is in the wrong format");
            }
        }
    });
}

$(function() {
    errorMessage = document.getElementById("loginError");
    showErrorMessage(null);
});