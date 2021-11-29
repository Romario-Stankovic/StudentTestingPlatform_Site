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

var students = [];
students.push(new Student("Romario", "Stankovic", "null", "2020230210"));
students.push(new Student("Jelena", "Vuksan", "null", "2020230129"));

function getStudent(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return i;
        }
    }
    return -1;
}

function getStudentName(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return students[i].firstName;
        }
    }
}

function getStudentLastName(index){
    for(i=0; i<students.length; i++){
        if(students[i].indexNo == index){
            return students[i].lastName;
        }
    }
}