

const difficultyNodes = document.querySelectorAll('.difficulty');
const difficultyP = document.querySelectorAll('.difficulty .number');
const ratingNodes = document.querySelectorAll('.rating');
const ratingP = document.querySelectorAll('.rating .number');
const workloadNodes = document.querySelectorAll('.workload');
const workloadP = document.querySelectorAll('.workload .number');

for(let i = 0; i<difficultyNodes.length; i++){

    let currentDifficulty = parseFloat(difficultyP[i].innerHTML);
    let currentRating = parseFloat(ratingP[i].innerHTML);
    let currentWorkload = parseFloat(workloadP[i].innerHTML);

    if(currentDifficulty >= 3.5){
        difficultyNodes[i].style.backgroundColor = "#FF474C";
    } else if (currentDifficulty >= 2){
        difficultyNodes[i].style.backgroundColor = "#FDAA48";
    } else if(currentDifficulty >= 1){
        difficultyNodes[i].style.backgroundColor = "#90EE90";
    }

    if(currentRating >= 3.5){
        ratingNodes[i].style.backgroundColor = "#90EE90";
    } else if (currentRating >= 2){
        ratingNodes[i].style.backgroundColor = "#FDAA48";
    } else if(currentRating >= 1){
        ratingNodes[i].style.backgroundColor = "#FF474C";
    }

    if(currentWorkload >= 3.5){
        workloadNodes[i].style.backgroundColor = "#FF474C";
    } else if (currentWorkload >= 2){
        workloadNodes[i].style.backgroundColor = "#FDAA48";
    } else if(currentWorkload >= 1){
        workloadNodes[i].style.backgroundColor = "#90EE90";
    }

    console.log(difficultyP[i].innerHTML);
}