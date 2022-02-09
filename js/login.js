async function studentLogin(event) {
    event.preventDefault();

    let indexNumber = document.getElementById("indexField").value;

    let loginResponse = await apiHandler(APIController.login, "student", { indexNumber: indexNumber });

    if (loginResponse.statusCode != undefined) {

        switch (loginResponse.statusCode) {
            case 400:
                alert("Bad index number format");
                break;
            case 4001:
                alert("Invalid index number");
                break;
            default:
                console.log(loginResponse);
        }

        return;
    }

    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("refreshToken", loginResponse.refreshToken);
    window.location = "studentMain.html";

}

async function professorLogin(event) {
    event.preventDefault();

    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;

    let loginResponse = await apiHandler(APIController.login,"professor", { username: username, password: password });

    if (loginResponse.statusCode != undefined) {

        switch (loginResponse.statusCode) {
            case 400:
                alert("Bad username or password");
                break;
            case 4001:
                alert("User not found");
                break;
            case 4002:
                alert("Bad password");
                break;
            default:
                console.log(loginResponse);
        }

        return;
    }

    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("refreshToken", loginResponse.refreshToken);
    window.location = "professorMain.html";
}