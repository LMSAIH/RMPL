
const overall = document.querySelector('.overall');
let inside = overall.innerHTML;
inside = inside.trim();
console.log(inside.substring(0,3));
inside = parseFloat(inside);

const difficulty = document.querySelector('.difficulty .number');
let difficultyValue = difficulty.innerHTML.trim().substring(0,3);
const workload = document.querySelector('.workload .number');
let workloadValue = workload.innerHTML.trim().substring(0,3);

if(inside>= 3.5){
    overall.style.backgroundColor = "#90EE90";
} else if(inside>=2){
    overall.style.backgroundColor = "#FDAA48"
} else if(inside>=1){
    overall.style.backgroundColor = "#FF474C";
}


if(difficultyValue>= 3.5){
    difficulty.style.backgroundColor = "#FF474C";
} else if(difficultyValue>=2){
    difficulty.style.backgroundColor = "#FDAA48"
} else if(difficultyValue>=1){
    difficulty.style.backgroundColor = "#90EE90";
}

if(workloadValue>= 3.5){
    workload.style.backgroundColor = "#FF474C";
} else if(workloadValue>=2){
    workload.style.backgroundColor = "#FDAA48"
} else if(workloadValue>=1){
    workload.style.backgroundColor = "#90EE90";
}