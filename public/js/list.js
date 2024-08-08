//Form listings
document
  .getElementById("listing")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

let subjects = document.getElementById("subjects");
let display = document.getElementById("subjDisplay");
let subjs = [];

const form = document.getElementById("listing");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formInfo = new FormData(document.getElementById("listing"));
    const formToJson = {};
    formInfo.forEach((value, key) => {
        formToJson[key] = value;
    });

    formToJson.subjects = subjs;
    console.log(formToJson);

    fetch('/newInstructor', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formToJson)
    })
    .then((response) => response.json())
    .then((data) => {console.log(data.redirect); window.location.href = data.redirect})
    .catch( err => console.log(err) );
    
});
    

function newSubject(e) {
  if (e.key === "Enter" && subjects.value.length > 1) {
    console.log("success");
    subjs.push(subjects.value);
    subjects.value = "";
    renderSubjects();

  }

}

function renderSubjects() {
  display.innerHTML = "";

  for (let i = 0; i < subjs.length; i++) {
    let div = document.createElement("div");
    div.id = "singleSubj" + i;
    div.innerHTML = "<p>" + subjs[i] + "</p>";
    div.addEventListener("click", function () {
      subjs.splice(i, 1);
      renderSubjects();
    });
    display.appendChild(div);
  }
    
}

let interval = setInterval(checkInp,1);
let submitButton = document.getElementById("submit");
function checkInp(){
  if (subjs.length > 0) {
    subjects.removeAttribute("required");
    submitButton.removeAttribute("disabled");
  } else {
    subjects.setAttribute("required","");
    submitButton.setAttribute("disabled","");
  }
}



subjects.addEventListener("keydown", newSubject);
