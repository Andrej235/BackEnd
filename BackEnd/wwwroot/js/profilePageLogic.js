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