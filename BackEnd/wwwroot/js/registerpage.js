import { Register } from '/js/main.js'
const registerBtn = document.querySelector(".submit-btn");
AddHoverAnimationsToButton(registerBtn);

const nameInputField = document.querySelector(".name-input");
const emailInputField = document.querySelector(".email-input");
const passwordInputField = document.querySelector(".password-input");
const repeatPasswordInputField = document.querySelector(".repeat-password-input");
registerBtn.addEventListener("click", e => {
    console.log(nameInputField.value);
    if (passwordInputField.value === repeatPasswordInputField.value)
        Register(nameInputField.value, emailInputField.value, passwordInputField.value);
    else
        console.log("Passwords don't match");
});