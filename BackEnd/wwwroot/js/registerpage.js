const registerBtn = document.querySelector(".submit-btn");
AddHoverAnimationsToButton(registerBtn);

const emailInputField = document.querySelector(".email-input");
const passwordInputField = document.querySelector(".password-input");
const repeatPasswordInputField = document.querySelector(".repeat-password-input");
registerBtn.addEventListener("click", e => {
    if (ValidateEmail(emailInputField.value) && ValidatePasswordAndRepeatPassword())
        Register(emailInputField.value, passwordInputField.value);
    else
        console.log("Invalid input");
});

const ValidatePasswordAndRepeatPassword = () => passwordInputField.value === repeatPasswordInputField.value && ValidatePassword(passwordInputField.value)