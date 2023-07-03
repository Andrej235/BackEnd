export function Register(name, email, password) {
    return fetch("https://localhost:7050/api/user/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Name: name, Email: email, Password: password })
    })
        .then(res => res.json())
        .then(user => {
            SaveUserID(user.id);
            document.location = "ProfilePage";
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



export function SaveUserID(id) {
    document.cookie = `userID = ${id}`
}

export function CheckForAdminPrivilages() {
    return fetch(`https://localhost:7050/api/user/getbyid/admin/${document.cookie.replace(/\D/g, "")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .catch(err => console.error(err));
}