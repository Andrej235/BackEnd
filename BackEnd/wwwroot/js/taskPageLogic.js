const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayTitle = document.querySelector("#day-title");
const timeFrameTitle = document.querySelector("#time-frame");
const classTemplate = document.querySelector("#class-row-template");
const classTable = document.querySelector("#class-table");

let currentShownDay = new Date().getDay();
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

    classes.forEach(classInfo => {
        const newClassRow = document.importNode(classTemplate.content, true);
        newClassRow.querySelector(".class-row").dataset.timeFrame =
            `${classInfo.classTimeFrame.startHour}:${classInfo.classTimeFrame.startMinute > 9 ? classInfo.classTimeFrame.startMinute : "0" + classInfo.classTimeFrame.startMinute} - ${classInfo.classTimeFrame.endHour}:${classInfo.classTimeFrame.endMinute > 9 ? classInfo.classTimeFrame.endMinute : "0" + classInfo.classTimeFrame.endMinute}`;

        newClassRow.querySelector(".class-number").append(classInfo.classTimeFrame.id);
        newClassRow.querySelector(".class-name").append(classInfo.name);

        if (classInfo.task !== null)
            newClassRow.querySelector(".class-row").dataset.hasTask = "true";

        classTable.appendChild(newClassRow);
    });

    const classRows = document.querySelectorAll(".class-row");
    let selectedClassRow = classRows[0];
    classRows.forEach(classRow => {
        classRow.querySelector(".class-name").addEventListener("click", e => {
            timeFrameTitle.innerText = `${classRow.dataset.timeFrame}`;

            selectedClassRow.classList.remove("selected");
            classRow.classList.add("selected");
            selectedClassRow = classRow;
        });
    })
}

//Add code for switching days here
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