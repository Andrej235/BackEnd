const hamburgerMenu = document.querySelector(".hamburger-menu");
hamburgerMenu.addEventListener("click", e => {
    hamburgerMenu.querySelector(".navigation-items-list").classList.toggle("active");
});

const navItems = hamburgerMenu.querySelectorAll(".navigation-item");
navItems.forEach(item => {
    item.addEventListener("click", e => {
        console.log("Navigate somewhere");
        document.location.href = item.dataset.link;
    });
});