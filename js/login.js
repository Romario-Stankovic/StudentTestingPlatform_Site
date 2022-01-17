function studentLogin(event){

    event.preventDefault();

    let indexNumber = document.getElementById("indexField").value;
    getStudent(indexNumber);
}

function getStudent(index){
    $.ajax({
        url: "http://localhost:4000/auth/login/student",
        method: "POST",
        dataType: "json",
        data: {
            indexNumber: index
        },
        success: function(data){
            console.log(data);
        }
    })
}

$(document).ready(() => {
    
});