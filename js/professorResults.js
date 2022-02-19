let resultTestInfo;

$(async function(){

    resultTestInfo = JSON.parse(sessionStorage.getItem("resultTestInfo"));

    loadTest();
    displayStudents();
})

function loadTest(){
    let testBrief = document.getElementById("testBrief");
    testBrief.innerText = resultTestInfo.testName;;
}

async function displayStudents() {

    let worksResponse = await apiHandler(APIController.getWork, "test", resultTestInfo.testId);

    let studentList = document.getElementById("studentList");

    clearContainer(studentList);

    if(worksResponse == undefined){
        alert("Could not contact API");
        return;
    }

    if(worksResponse.statusCode != undefined){
        switch(worksResponse.statusCode){
            case 400:
                alert("Bad request");
                break;
            case 401:
                professorLogout();
                break;
            case 403:
                alert("Forbidden");
                break;
            case 2001:
                studentList.innerText = "No works for this test";
                break;
            default:
                console.log(worksResponse);
        }
        return;
    }

    for(let work of worksResponse){
        let studentInfo = work.student.firstName + " " + work.student.lastName + " - " + work.student.indexNumber;
        addStudentResult(studentList, work.workId, resultTestInfo.testName, studentInfo, work.points);
    }

}

function goToProfessorMain(event){
    event.preventDefault();
    window.location = "professorMain.html";
}

function viewWork(workId, testName) {
    let resultInfo = {
        professorId : resultTestInfo.professorId,
        workId: workId,
        testName: testName
    }
    sessionStorage.setItem("resultInfo", JSON.stringify(resultInfo));
    window.location = "viewWork.html";
}

function refreshResults(){
    displayStudents();
}