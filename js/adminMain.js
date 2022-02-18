let identity;

$(async function() {

    hideUserDialog();

    await displayAdminInfo();

    displayAdmins();
})

async function displayAdminInfo(){
    let adminBrief = document.getElementById("adminBrief");

    let identityResponse = await apiHandler(APIController.getIdentity);

    if(identityResponse.statusCode != undefined){
        switch(identityResponse.statusCode){
            case 401:
                logout();
                break;
            default:
                console.log(identityResponse);
        }
        return;
    }

    if(identityResponse.role != "administrator"){
        logout();
    }

    identity = identityResponse;

    adminBrief.innerText = identity.firstName + " " + identity.lastName;

}

async function displayAdmins(){
    let adminsResponse = await apiHandler(APIController.getAllAdmins);

    let userTypeInfo = document.getElementById("userTypeInfo");
    let addUserButton = document.getElementById("addUserButton");

    if(adminsResponse.statusCode != undefined) {
        switch(adminsResponse.statusCode){
            default:
                console.log(adminsResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of adminsResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.username, "admin", user.administratorId);
    }

    userTypeInfo.innerText = "Administrators:";
    addUserButton.onclick = function(){
        showUserDialog(null, "admin");
    }

}

async function displayProfessors(){
    let professorResponse = await apiHandler(APIController.getAllProfessors);

    let userList = document.getElementById("userList");

    if(professorResponse.statusCode != undefined) {
        switch(professorResponse.statusCode){
            default:
                console.log(professorResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of professorResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.username, "professor", user.professorId);
    }

    userTypeInfo.innerText = "Professors:";
    addUserButton.onclick = function(){
        showUserDialog(null, "professor");
    }

}

async function displayStudents(){
    let studentResponse = await apiHandler(APIController.getAllStudents);

    if(studentResponse.statusCode != undefined) {
        switch(studentResponse.statusCode){
            default:
                console.log(studentResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of studentResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.indexNumber, "student", user.studentId);
    }

    userTypeInfo.innerText = "Students:";
    addUserButton.onclick = function(){
        showUserDialog(null, "student");
    }

}

async function deleteUser(type, id){

    let userResponse;

    if(type == "admin"){
        let data = {
            administratorId: Number.parseInt(id)
        }
        userResponse = await apiHandler(APIController.deleteAdmin, data);
    }else if(type == "professor"){
        let data = {
            professorId: Number.parseInt(id)
        }
        userResponse = await apiHandler(APIController.deleteProfessor, data);
    }else if(type == "student"){
        let data = {
            studentId: Number.parseInt(id)
        }
        userResponse = await apiHandler(APIController.deleteStudent, data);
    }

    if(userResponse.statusCode != undefined){
        switch(userResponse.statusCode){
            case 0:
                if(type == "admin"){
                    displayAdmins();
                }else if(type == "professor"){
                    displayProfessors();
                }else if(type == "student"){
                    displayStudents();
                }
                break;
            default:
                console.log(userResponse);
        }
    }
}

function hideUserDialog() {
    let userOverlay = document.getElementById("userOverlay");
    userOverlay.style.display = "none";
}

function showUserDialog(id, type) {
    let userOverlay = document.getElementById("userOverlay");
    let title = document.getElementById("userOverlayTitle");
    let actionButton = document.getElementById("actionButton");

    loadUser(id, type);

    actionButton.innerText = (id == null? "Add" : "Save");

    if(id != null){
        actionButton.onclick = function(){
            updateUser(id, type);
        }
    }else {
        actionButton.onclick = function(){
            addUser(type);
        }
    }

    title.innerText = (id == null ? "Add" : "Update") + " " + type;
    userOverlay.style.display = "block";

}

async function loadUser(id, type) {

    let firstNameField = document.getElementById("firstNameField");
    let lastNameField = document.getElementById("lastNameField");
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let indexNumberField = document.getElementById("indexNumberField");

    firstNameField.value = null;
    lastNameField.value = null;
    usernameField.value = null;
    passwordField.value = null;
    indexNumberField.value = null;

    if(type == "student"){
        indexNumberField.parentElement.style.display = "block";
        usernameField.parentElement.style.display = "none";
        passwordField.parentElement.style.display = "none";
    }else if(type == "admin"){
        indexNumberField.parentElement.style.display = "none";
        usernameField.parentElement.style.display = "block";
        passwordField.parentElement.style.display = "block";
    }else if(type == "professor"){
        indexNumberField.parentElement.style.display = "none";
        usernameField.parentElement.style.display = "block";
        passwordField.parentElement.style.display = "block";
    }
    
    if(id == null){
        return;
    }
    
    let userResponse;

    if(type == "student"){
        userResponse = await apiHandler(APIController.getStudent, id);
    }else if(type == "admin"){
        userResponse = await apiHandler(APIController.getAdministrator, id);
    }else if(type == "professor"){
        userResponse = await apiHandler(APIController.getProfessor, id);
    }
    
    if(userResponse.statusCode != undefined){
        switch(userResponse.statusCode){
            default:
                console.log(userResponse);
        }
        return;
    }

    firstNameField.value = userResponse.firstName;
    lastNameField.value = userResponse.lastName;
    usernameField.value = userResponse.username;
    passwordField.value = "";
    indexNumberField.value = userResponse.indexNumber;

}

async function addUser(type){

    let firstNameField = document.getElementById("firstNameField");
    let lastNameField = document.getElementById("lastNameField");
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let indexNumberField = document.getElementById("indexNumberField");

    let createResponse;

    if(type == "student"){
        let data = {
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            indexNumber: indexNumberField.value
        }
        createResponse = await apiHandler(APIController.addStudent, data);
    }else if(type == "admin"){
        let data = {
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value
        }
        createResponse = await apiHandler(APIController.addAdmin, data);
    }else if(type == "professor"){
        let data = {
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value
        }
        createResponse = await apiHandler(APIController.addProfessor, data);
    }

    if(createResponse.statusCode != undefined){
        switch(createResponse.statusCode){
            default:
                console.log(createResponse);
        }
        return;
    }

    hideUserDialog();

    if(type == "student"){
        displayStudents();
    }else if(type == "admin"){
        displayAdmins();
    }else if(type == "professor"){
        displayProfessors();
    }

}

async function updateUser(id, type){

    let firstNameField = document.getElementById("firstNameField");
    let lastNameField = document.getElementById("lastNameField");
    let usernameField = document.getElementById("usernameField");
    let passwordField = document.getElementById("passwordField");
    let indexNumberField = document.getElementById("indexNumberField");

    let createResponse;

    if(type == "student"){
        let data = {
            studentId: Number.parseInt(id),
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            indexNumber: indexNumberField.value
        }
        createResponse = await apiHandler(APIController.updateStudent, data);
    }else if(type == "admin"){
        let data = {
            administratorId: Number.parseInt(id),
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value.length != 0 ? passwordField.value : null
        }
        createResponse = await apiHandler(APIController.updateAdmin, data);
    }else if(type == "professor"){
        let data = {
            professorId : Number.parseInt(id),
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value.length != 0 ? passwordField.value : null
        }
        createResponse = await apiHandler(APIController.updateProfessor, data);
    }

    if(createResponse.statusCode != undefined){
        switch(createResponse.statusCode){
            case 0:
                hideUserDialog();
                if(type == "student"){
                    displayStudents();
                }else if(type == "admin"){
                    displayAdmins();
                }else if(type == "professor"){
                    displayProfessors();
                }
                break;
            default:
                console.log(createResponse);
        }
        return;
    }

}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location = "adminLogin.html";
}