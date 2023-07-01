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

        newClassRow.querySelector(".class-number").append(classInfo.classTimeFrame.id);
        newClassRow.querySelector(".class-name").append(classInfo.name);

        if (classInfo.task !== null) {
            newClassRow.querySelector(".class-row").dataset.hasTask = "true";
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

            if (classRow.dataset.taskType !== undefined) {
                taskType.innerText = `${classRow.dataset.taskType}`;
                taskDescription.innerText = `${classRow.dataset.taskDescription}`;
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
const editTaskTypeInputField = document.querySelector("#task-type-edit-input");
const editTaskDescriptionInputField = document.querySelector("#task-description-edit-input");
let isEditModeEnabled = false;
editBtn.addEventListener("click", e => {
    ToggleEditMode();
});

async function ToggleEditMode() {
    let selectedRow;
    document.querySelectorAll(".class-row").forEach(row => {
        if (row.classList.contains("selected")) {
            selectedRow = row;
        }
    })

    if (selectedRow !== undefined) {
        isEditModeEnabled = !isEditModeEnabled;
        const isAdmin = await CheckForAdminPrivilages();

        editTaskTypeInputField.classList.toggle("active");
        editTaskDescriptionInputField.classList.toggle("active");
        taskType.classList.toggle("active");
        taskDescription.classList.toggle("active");

        editTaskTypeInputField.value = taskType.innerText;
        editTaskDescriptionInputField.value = taskDescription.innerText;
        console.log(isAdmin ? "Entering edit mode..." : "Only admin accounts can access edit mode...");
    }
}