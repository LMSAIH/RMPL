let loginForm = document.getElementById("loginForm");

//loging form logic to gather the information
loginForm.addEventListener("keydown", (e) => {
  let submitLogIn = document.getElementById("logButton");
  let username = document.getElementById("loginUser");
  let password = document.getElementById("loginPassword");

  if (username.value.length >= 7 && password.value.length >= 7) {
    submitLogIn.removeAttribute("disabled");
  } else {
    submitLogIn.setAttribute("disabled", true);
  }
});

let signInForm = document.getElementById("signInForm");

//changed container
let checkboxesContainer = document.getElementById("checkboxes");

signInForm.addEventListener("keydown", (e) => {
  let submitSignIn = document.getElementById("submitButton");
  let username = document.getElementById("signInUsername");
  let password = document.getElementById("signInPassword");

  submitSignIn.setAttribute("disabled", true);

  //Do it only once

  setTimeout(() => {
    checkboxesContainer.classList.add("displaying");
  }, 400);

  let firstCheckBox = document.querySelector("div.upperCase");
  let firstCheckMark = firstCheckBox.querySelector(".checked");
  let firstXMark = firstCheckBox.querySelector(".notChecked");
  firstXMark.style.display = "block";
  firstCheckMark.style.display = "none";
  let secondCheckBox = document.querySelector("div.letters8");
  let secondCheckMark = secondCheckBox.querySelector(".checked");
  let secondXMark = secondCheckBox.querySelector(".notChecked");
  secondXMark.style.display = "block";
  secondCheckMark.style.display = "none";
  let thirdCheckBox = document.querySelector("div.number1");
  let thirdCheckMark = thirdCheckBox.querySelector(".checked");
  let thirdXMark = thirdCheckBox.querySelector(".notChecked");
  thirdXMark.style.display = "block";
  thirdCheckMark.style.display = "none";

  let hasUpperCase = false;
  let length8 = false;
  let num1 = false;

  for (let i = 0; i < password.value.length; i++) {
    let current = password.value[i];

    if (current >= "A" && current <= "Z") {
      hasUpperCase = true;
    }

    if (current >= "0" && current <= "9") {
      num1 = true;
    }
  }

  if (password.value.length >= 7) {
    length8 = true;
  }

  if (hasUpperCase) {
    firstCheckMark.style.display = "block";
    firstXMark.style.display = "none";
  }

  if (length8) {
    secondCheckMark.style.display = "block";
    secondXMark.style.display = "none";
  }

  if (num1) {
    thirdCheckMark.style.display = "block";
    thirdXMark.style.display = "none";
  }

  if (hasUpperCase && length8 && num1 && username.value.length>=7) {
    submitSignIn.removeAttribute("disabled");
  } else {
    submitSignIn.setAttribute("disabled", true);
  }
});
