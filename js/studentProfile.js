let identity = null;
let studentNameLabel = null;
let studentIndexLabel = null;
let studentProfilePhoto = null;

function loadData(){
    studentNameLabel.innerText = identity.firstName + " " + identity.lastName;
    studentIndexLabel.innerText = identity.indexNumber;
    console.log(identity.imagePath);
    studentProfilePhoto.src = "http://localhost:4000/assets/images/" + identity.imagePath;
}

function getIdentity(){
    
    if(localStorage.getItem("token") == null || localStorage.getItem("refreshToken") == null){
        logout();
    }

    $.ajax({
        url: "http://localhost:4000/auth/token/identity",
        method: "POST",
        headers: {
            "Authorization" : "Bearer " + localStorage.getItem("token")
        },
        success: function(data){
            if(data.code == undefined){
                if(data.role == "student"){
                    identity = data;
                }else{
                    logout();
                }
            }
        },
        statusCode: {
            401: function(){
                console.log("Refreshing token...");
                $.ajax({
                    url: "http://localhost:4000/auth/token/refresh",
                    method: "POST",
                    data: {
                        refreshToken: localStorage.getItem("refreshToken")
                    },
                    success: function(data){
                        if(data.code == undefined){
                            localStorage.setItem("token", data.token);
                            localStorage.setItem("refreshToken", data.refreshToken);
                            window.location.reload();
                        }else{
                            logout();
                        }
                    },
                    statusCode:{
                        400: function(){
                            logout();
                        }
                    }
                })
            }
        }
    }).done(function() {
        loadData();
    });
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location = "studentLogin.html";
}

function goToTests(){
    window.location = "studentTests.html";
}

$(function(){
    studentNameLabel = document.getElementById("studentNameLabel");
    studentIndexLabel = document.getElementById("studentIndexLabel");
    studentProfilePhoto = document.getElementById("studentProfilePhoto");
    studentNameLabel.innerText = "ㅤ";
    studentIndexLabel.innerText = "ㅤ";
    getIdentity();
})