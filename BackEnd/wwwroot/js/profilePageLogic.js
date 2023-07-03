//Redirect to log in page if user is not logged in
const userID = document.cookie.replace(/\D/g, "");
if (userID === "0" || userID === "")
    document.location = "LoginPage"

const logOutBtn = document.querySelector("#log-out-btn");
logOutBtn.addEventListener("click", () => {
    document.cookie = "userID = 0";
    document.location = "LoginPage";
    console.log(document.cookie.replace(/\D/g, ""));
})

const nameTitle = document.querySelector("#name-title");
const emailTitle = document.querySelector("#email-title");
fetch(`https://localhost:7050/api/user/getbyid/${userID}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(res => res.json())
    .then(user => {
        nameTitle.innerText = user.name;
        emailTitle.innerText = user.email;
    })
    .catch(err => console.error(err));