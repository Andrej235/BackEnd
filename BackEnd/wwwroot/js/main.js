function AddHoverAnimationsToButton(btn) {
    btn.addEventListener("mouseover", e => btn.classList.add("hover-enter"));
    btn.addEventListener("mouseleave", e => btn.classList.remove("hover-enter"));
}

function ValidateEmail(email) {
    // if (email !== "" && email.includes("@gmail.com")) console.log("Valid Email");
    return email !== "" && email.includes("@gmail.com");
}
function ValidatePassword(password) {
    if (password === "")
        return false;

    let passwordHasNum = false;
    for (let i = 0; i < password.length; i++) {
        const c = password[i];
        if (!isNaN(parseFloat(c)) && isFinite(c)) {
            passwordHasNum = true;
            break;
        }
    }
    // if (passwordHasNum && password.length >= 8) console.log("Valid password");
    return passwordHasNum && password.length >= 8;
}

/*********************************************************************************************************/

class User {
    id;
    email;
    password;

    constructor(id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}

function Register(email, password) {
    fetch(`https://localhost:7050/api/user/getbyemail/${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok) {
                console.warn(`User with email ${email} already exists`);
                return;
            }

            if (res.status === 404) {
                console.log("Added an account");
                EnterNewUser(email, password);
                return;
            }
            else {
                throw new Error(res.status);
            }
        })
        .catch(err => console.error(err));
}

function EnterNewUser(email, password) {
    return fetch("https://localhost:7050/api/user/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Email: email, Password: password })
    })
        .catch(err => console.error(err));
}

function GetAllUsers() {
    return fetch("https://localhost:7050/api/user/getall", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => console.error(err));
}

function DeleteUser(id) {
    return fetch(`https://localhost:7050/api/user/delete/${user.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .catch(err => console.error(err));
}