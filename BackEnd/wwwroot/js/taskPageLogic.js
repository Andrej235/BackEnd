import { CheckForAdminPrivilages } from '/js/main.js'

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayTitle = document.querySelector("#day-title");
const timeFrameTitle = document.querySelector("#time-frame");
const classTemplate = document.querySelector("#class-row-template");
const classTable = document.querySelector("#class-table");
const taskType = document.querySelector("#task-type");
const taskDescription = document.querySelector("#task-description");

let currentShownDay = new Date().getDay();
currentShownDay = currentShownDay < 5 ? currentShownDay > 1 ? currentShownDay : 1 : 5;
PopulateTable(currentShownDay);
function GetAllClassesInADay(id) {
    return fetch(`https://localhost:7050/api/day/getclasses/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(err => console.error(err));
}

async function PopulateTable(dayID) {
    classTable.innerHTML = "";
    const day = await GetAllClassesInADay(dayID);
    const classes = day.classes;

    //dayTitle.append(`${dayNames[day.name]}`);
    dayTitle.innerText = `${dayNames[day.name]}`;
    timeFrameTitle.innerText = "";
    taskType.innerText = ``;
    taskDescription.innerText = ``;

    classes.forEach(classInfo => {
        const newClassRow = document.importNode(classTemplate.content, true);
        const classRow = newClassRow.querySelector(".class-row");

        classRow.dataset.timeFrame = `${classInfo.classTimeFrame.startHour}:${classInfo.classTimeFrame.startMinute > 9 ? classInfo.classTimeFrame.startMinute : "0" + classInfo.classTimeFrame.startMinute} - ${classInfo.classTimeFrame.endHour}:${classInfo.classTimeFrame.endMinute > 9 ? classInfo.classTimeFrame.endMinute : "0" + classInfo.classTimeFrame.endMinute}`;
        classRow.dataset.classId = classInfo.id;

        newClassRow.querySelector(".class-number").append(classInfo.classTimeFrame.id);
        newClassRow.querySelector(".class-name").append(classInfo.name);

        if (classInfo.task !== null) {
            classRow.dataset.hasTask = "true"; //This is used in css
            classRow.dataset.taskId = classInfo.task.id;
            classRow.dataset.taskType = classInfo.task.type;
            classRow.dataset.taskDescription = classInfo.task.description;
        }

        classTable.appendChild(newClassRow);
    });

    const classRows = document.querySelectorAll(".class-row");
    let selectedClassRow = classRows[0];
    classRows.forEach(classRow => {
        classRow.querySelector(".class-name").addEventListener("click", e => {
            if (isEditModeEnabled) {
                ToggleEditMode();
            }

            if (classRow.dataset.hasTask === "true") {
                taskType.innerText = classRow.dataset.taskType;
                taskDescription.innerText = classRow.dataset.taskDescription;
            }
            else {
                taskType.innerText = ``;
                taskDescription.innerText = ``;
            }

            timeFrameTitle.innerText = `${classRow.dataset.timeFrame}`;

            selectedClassRow.classList.remove("selected");
            classRow.classList.add("selected");
            selectedClassRow = classRow;
        });
    })
}

//Switching days
const leftArrowBack = document.querySelector(".fa-arrow-left");
const rightArrowForward = document.querySelector(".fa-arrow-right");

leftArrowBack.addEventListener("click", e => {
    currentShownDay--;
    if (currentShownDay < 1)
        currentShownDay = 5;

    PopulateTable(currentShownDay);
});

rightArrowForward.addEventListener("click", e => {
    currentShownDay++;
    if (currentShownDay > 5)
        currentShownDay = 1;

    PopulateTable(currentShownDay);
});



//Edit mode
const editBtn = document.querySelector("#task-edit-btn");
const deleteBtn = document.querySelector("#task-delete-btn");
const editTaskTypeInputField = document.querySelector("#task-type-edit-input");
const editTaskDescriptionInputField = document.querySelector("#task-description-edit-input");
let isEditModeEnabled = false;
editBtn.addEventListener("click", e => {
    ToggleEditMode();
});

deleteBtn.addEventListener("click", e => {
    let selectedRow;
    document.querySelectorAll(".class-row").forEach(row => {
        if (row.classList.contains("selected")) {
            selectedRow = row;
        }
    })

    if (isEditModeEnabled) {
        fetch(`https://localhost:7050/api/task/removefromclass/${selectedRow.dataset.classId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                selectedRow.dataset.hasTask = "false";

                editTaskTypeInputField.value = "";
                editTaskDescriptionInputField.value = "";
                taskType.innerText = "";
                taskDescription.innerText = "";

                ToggleEditMode();
                console.log(`Removed task from class with id: ${selectedRow.dataset.classId}`);
            })
            .catch(err => console.error(err))
    }
});

async function ToggleEditMode() {
    let selectedRow;
    document.querySelectorAll(".class-row").forEach(row => {
        if (row.classList.contains("selected")) {
            selectedRow = row;
        }
    })

    if (selectedRow !== undefined) {
        const isAdmin = await CheckForAdminPrivilages();
        if (!isAdmin)
            return;

        editTaskTypeInputField.classList.toggle("active");
        editTaskDescriptionInputField.classList.toggle("active");
        taskType.classList.toggle("active");
        taskDescription.classList.toggle("active");

        selectedRow.dataset.hasTask === "true" ? deleteBtn.classList.toggle("active") : deleteBtn.classList.remove("active");

        if (!isEditModeEnabled) {
            editTaskTypeInputField.value = taskType.innerText;
            editTaskDescriptionInputField.value = taskDescription.innerText;
            console.log("Entering edit mode...");
        }
        else {
            if (selectedRow.dataset.hasTask === "true") {
                //Edit
                fetch(`https://localhost:7050/api/task/${selectedRow.dataset.taskId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: editTaskTypeInputField.value,
                        description: editTaskDescriptionInputField.value
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                        taskType.innerText = res.type;
                        taskDescription.innerText = res.description;

                        selectedRow.dataset.taskType = res.type;
                        selectedRow.dataset.taskDescription = res.description;

                        console.log("Updated task info");
                    })
                    .catch(err => console.error(err))
            }
            else if (editTaskTypeInputField.value !== "" || editTaskDescriptionInputField.value !== "") {
                //Add task to class with id selectedRow.dataset.classId
                fetch(`https://localhost:7050/api/task/add/${selectedRow.dataset.classId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: editTaskTypeInputField.value,
                        description: editTaskDescriptionInputField.value
                    })
                })
                    .then(res => res.json())
                    .then(newTask => {
                        selectedRow.dataset.hasTask = "true";
                        selectedRow.dataset.taskId = newTask.id;
                        selectedRow.dataset.taskType = newTask.type;
                        selectedRow.dataset.taskDescription = newTask.description;

                        taskType.innerText = newTask.type;
                        taskDescription.innerText = newTask.description;
                    })
                    .catch(err => console.error(err));
            }

            console.log("Exiting edit mode...");
        }

        isEditModeEnabled = !isEditModeEnabled;
    }
}