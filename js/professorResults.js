let resultTestInfo;

$(async function(){

    resultTestInfo = JSON.parse(sessionStorage.getItem("resultTestInfo"));

    displayTestInfo();
    displayStudents();
})

function displayTestInfo(){
    let testBrief = document.getElementById("testBrief");
    testBrief.innerText = resultTestInfo.testName;;
}

async function displayStudents() {

    let worksResponse = await apiHandler(APIController.getStudentResults, resultTestInfo.testId);

    let studentList = document.getElementById("studentList");

    clearContainer(studentList);

    if(worksResponse == undefined){
        return;
    }

    if(worksResponse.statusCode != undefined){
        switch(worksResponse.statusCode){
            default:
                console.log(worksResponse);
        }
        return;
    }

    for(let work of worksResponse){
        addStudentResult(studentList, work.workId, resultTestInfo.testName, work.studentIndexNumber, work.points);
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