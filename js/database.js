class Student{
    firstName;
    lastName;
    imagePath;
    indexNo;
    constructor(firstName, lastName, imagePath, indexNo){
        this.firstName = firstName;
        this.lastName = lastName;
        this.imagePath = imagePath;
        this.indexNo = indexNo;
    }
};

class Test {
    id;
    name;
    constructor(id, name, testID){
        this.id = id;
        this.name = name;
    }
}

class Question {
    id;
    idTest;
    image;
    text;
    constructor(id, idTest, image, text){
        this.id = id;
        this.idTest = idTest;
        this.image = image;
        this.text = text;
    }
}

class Answer {
    idQuestion;
    text;
    constructor(idQuestion, text){
        this.idQuestion = idQuestion;
        this.text = text;
    }
}

var students = [];
students.push(new Student("Romario", "Stanković", null, "2020230210"));
students.push(new Student("Jelena", "Vuksan", null, "2020230129"));
students.push(new Student("Nikola", "Zoric", null, "2020230070"));

var tests = [];
tests.push(new Test(1, "Algorithms and Data Structures - SDE 2 - Midterm 2", 1));
tests.push(new Test(2, "Sensor Systems - SDE 2 - Finel Exam", 2));

var question = [];
question.push(new Question(0, 1,null, "Question 1"));
question.push(new Question(1, 1,null, "Question 2"));

var answers = [];
answers.push(new Answer(0, "Answer1"));
answers.push(new Answer(0, "Answer2"));
answers.push(new Answer(0, "Answer3"));
answers.push(new Answer(0, "Answer4"));
answers.push(new Answer(1, "Answer5"));
answers.push(new Answer(1, "Answer6"));
answers.push(new Answer(1, "Answer7"));
answers.push(new Answer(1, "Answer8"));

function getStudent(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return true;
        }
    }
    return false;
}

function getStudentName(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return students[i].firstName;
        }
    }
    return "null";
}

function getStudentLastName(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return students[i].lastName;
        }
    }
    return "null";
}

function getStudentProfilePhoto(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return students[i].imagePath;
        }
    }
    return "null";
}

function getAvailableTests(){
    return tests;
}

function getFinishedTests(){
    return tests;
}

function getTest(id){
    for(i=0; i<tests.length; i++){
        if(tests[i].testID == id){
            return test[i];
        }
    }
    return "null";
}