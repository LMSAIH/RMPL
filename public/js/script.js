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

subjects.addEventListener("keydown", newSubject);
