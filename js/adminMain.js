let identity;

$(async function() {

    hideUserDialog();

    await displayAdminInfo();

    displayAdmins();
})

async function displayAdminInfo(){
    let adminBrief = document.getElementById("adminBrief");

    let identityResponse = await apiHandler(APIController.getIdentity);

    if(identityResponse == undefined){
        alert("Could not contact API");
        adminLogout();
        return;
    }

    if(identityResponse.statusCode != undefined){
        switch(identityResponse.statusCode){
            case 401:
                adminLogout();
                break;
            case 4001:
                adminLogout();
                break;
            default:
                console.log(identityResponse);
        }
        return;
    }

    if(identityResponse.role != "administrator"){
        adminLogout();
    }

    identity = identityResponse;

    adminBrief.innerText = identity.firstName + " " + identity.lastName;

}

async function displayAdmins(){
    let adminsResponse = await apiHandler(APIController.getAllAdmins);

    let userTypeInfo = document.getElementById("userTypeInfo");
    let addUserButton = document.getElementById("addUserButton");

    let userList = document.getElementById("userList");
    
    userTypeInfo.innerText = "Administrators:";
    addUserButton.onclick = function(){
        showUserDialog(null, "admin");
    }

    if(adminsResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(adminsResponse.statusCode != undefined) {
        switch(adminsResponse.statusCode){
            case 400:
                alert(adminsResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                userList.innerText = "No Administrators";
                break;
            default:
                console.log(adminsResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of adminsResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.username, "admin", user.administratorId);
    }

}

async function displayProfessors(){
    let professorResponse = await apiHandler(APIController.getAllProfessors);

    let userTypeInfo = document.getElementById("userTypeInfo");
    let addUserButton = document.getElementById("addUserButton");

    let userList = document.getElementById("userList");


    userTypeInfo.innerText = "Professors:";
    addUserButton.onclick = function(){
        showUserDialog(null, "professor");
    }

    if(professorResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(professorResponse.statusCode != undefined) {
        switch(professorResponse.statusCode){
            case 400:
                alert(professorResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                userList.innerText = "No Professors";
                break;
            default:
                console.log(professorResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of professorResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.username, "professor", user.professorId);
    }

}

async function displayStudents(){
    let studentResponse = await apiHandler(APIController.getAllStudents);

    let userTypeInfo = document.getElementById("userTypeInfo");
    let addUserButton = document.getElementById("addUserButton");

    let userList = document.getElementById("userList");

    userTypeInfo.innerText = "Students:";
    addUserButton.onclick = function(){
        showUserDialog(null, "student");
    }

    if(studentResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(studentResponse.statusCode != undefined) {
        switch(studentResponse.statusCode){
            case 400:
                alert(studentResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                userList.innerText = "No Students";
                break;
            default:
                console.log(studentResponse);
        }
        return;
    }

    clearContainer(userList);

    for(let user of studentResponse){
        addEditableUser(userList, user.firstName + " " + user.lastName + " - " + user.indexNumber, "student", user.studentId);
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

    if(userResponse == undefined){
        alert("Could not contact API");
        return;
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
            case 400:
                alert(userResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1002:
                alert("Failed to delete");
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
    let photoButton = document.getElementById("photoButton");

    loadUser(id, type);

    actionButton.innerText = (id == null? "Add" : "Save");

    if(id != null){
        actionButton.onclick = function(){
            updateUser(id, type);
        }

        if(type == "admin"){
            photoButton.style.display = "none";
        }else{
            photoButton.style.display = "block";
        }

    }else {
        actionButton.onclick = function(){
            addUser(type);
        }
        photoButton.style.display = "none";
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
    
    if(userResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(userResponse.statusCode != undefined){
        switch(userResponse.statusCode){
            case 400:
                alert(userResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                alert("Can't load data");
                break;
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

    if(createResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(createResponse.statusCode != undefined){
        switch(createResponse.statusCode){
            case 400:
                alert(createResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2002:
                if(type == "student"){
                    alert("Index number is already taken");
                }else{
                    alert("username is already taken");
                }
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
    let photoField = document.getElementById("uploadInput");

    console.log(photoField.files);

    if(photoField.files.length > 0){
        let formData = new FormData();
        formData.append("image", photoField.files[0]);
        let uploadResponse;
        
        if(type == "student"){
            uploadResponse = await apiHandler(APIController.uploadStudentPhoto, id, formData);
        }else if(type == "professor"){
            uploadResponse = await apiHandler(APIController.uploadProfessorPhoto, id, formData);
        }

        if(uploadResponse == undefined){
            alert("Could not contact API");
        }

        if (uploadResponse.statusCode != undefined) {
            switch (uploadResponse.statusCode) {
                case 0:
                    alert("Photo upload successful");
                    break;
                case 401:
                    adminLogout();
                    break;
                case 403:
                    alert("Forbidden");
                    break;
                case 413:
                    alert("Image too large");
                    break;
                case 415:
                    alert("Image in the wrong format");
                    break;
                case 1001:
                    alert("Upload failed");
                    break;
                case 2001:
                    alert("Saving failed");
                    break;
                case 2003:
                    alert("Saving failed");
                    break;
                default:
                    console.log(uploadResponse);
            }
        }

        photoField.value = "";
    }

    let updateResponse;

    if(type == "student"){
        let data = {
            studentId: Number.parseInt(id),
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            indexNumber: indexNumberField.value
        }
        updateResponse = await apiHandler(APIController.updateStudent, data);
    }else if(type == "admin"){
        let data = {
            administratorId: Number.parseInt(id),
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value.length != 0 ? passwordField.value : null
        }
        updateResponse = await apiHandler(APIController.updateAdmin, data);
    }else if(type == "professor"){
        let data = {
            professorId : Number.parseInt(id),
            firstName : firstNameField.value,
            lastName: lastNameField.value,
            username: usernameField.value,
            password: passwordField.value.length != 0 ? passwordField.value : null
        }
        updateResponse = await apiHandler(APIController.updateProfessor, data);
    }

    if(updateResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(updateResponse.statusCode != undefined){
        switch(updateResponse.statusCode){
            case 0:
                hideUserDialog();
                if(type == "student"){
                    displayStudents();
                }else if(type == "admin"){
                    displayAdmins();
                }else if(type == "professor"){
                    displayProfessors();
                }
                alert("Success");
                break;
            case 400:
                alert(updateResponse.message);
                break;
            case 401:
                adminLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 1001:
                alert("Saving failed");
                break;
            case 2002:
                if(type == "student"){
                    alert("Index number is already taken");
                }else{
                    alert("username is already taken");
                }
                break;
            default:
                console.log(updateResponse);
        }
        return;
    }

}

function showUploadDialog() {
    let uploadInput = document.getElementById("uploadInput");
    uploadInput.click();
}