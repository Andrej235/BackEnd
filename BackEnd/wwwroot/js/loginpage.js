import { SaveUserID } from '/js/main.js'

const loginBtn = document.querySelector(".submit-btn");
const emailInputField = document.querySelector(".email-input");
const passwordInputField = document.querySelector(".password-input");
const repeatPasswordInputField = document.querySelector(".repeat-password-input");
loginBtn.addEventListener("click", e => LogIn());

async function LogIn() {
    fetch(`https://localhost:7050/api/user/getbyemail/${emailInputField.value}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok)
                return res.json();

            if (res.status === 404)
                throw new Error("404: Account doesn't exist. (User probably needs to register)");
            else
                throw new Error(res.status);
        })
        .then(res => {
            if (passwordInputField.value === res.password) {
                console.log("Logged in");
                SaveUserID(res.id);
                document.location = "ProfilePage";
            }
            else
                console.log("Invalid log in information");
        })
        .catch(err => console.error(err));
}