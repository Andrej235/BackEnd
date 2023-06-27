let isHamburgerMenuExpended = false;
const hamburgerMenu = document.querySelector(".hamburger-menu");
hamburgerMenu.addEventListener("click", e => {
    isHamburgerMenuExpended = !isHamburgerMenuExpended;

    console.log("Open/Close nav menu " + isHamburgerMenuExpended);
});

const navItems = hamburgerMenu.querySelectorAll(".navigation-item");
navItems.forEach(item => {
    item.addEventListener("click", e => {
        console.log("Navigate somewhere");
        document.location.href = item.dataset.link;
    });
});