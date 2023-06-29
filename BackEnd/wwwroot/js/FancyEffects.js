/*
*   DOCUMENTATION
?   *************

?   AddRandomizedEffectToClass(className, iterationsPerLetter, iterationsPerSecond, lettersForRandomization)
    className - name of the class thats going to be affected by this effect on hover. Default class name is "randomized-text-effect"
    iterationsPerLetter - how many iterations of randomized letters happen before ONE letter gets set to it's base value
    iterationsPerSecond - how many iterations of randomized letters happen per second
    lettersForRandomization - what letters will be used in randomization (default is alphabet without letter 'Q')
*   ALL text that is supposed to be affected by this function MUST have an HTML attribute named "data-value" and it's value should be whatever is written inside it

?   AddBlobEffectToMouse(blobID, speed)
    blobID - ID of the div thats going to get properties of the blob - moving with the cursor. Default ID is "blob"
    speed - Speed at which the blob moves towards the cursor - higher the value slower the blob moves (It signifies the duration of the animation)
    Works best on dark mode / dark backgrounds
    Inside a div with the id of blobID needs to be another div which will have the background and have transform: translate(0, 0), while the blobID should have transform: translate(-50%, -50%)
*/

export function AddRandomizedEffectToClass(className = "randomized-text-effect", iterationsPerLetter = 5, iterationsPerSecond = 30, lettersForRandomization = "ABCDEFGHIJKLMNOPRSTUVWXYZ") {
    document.querySelectorAll(`.${className}`).forEach(item => {
        if (!item.hasAttribute("data-value")) {
            console.warn(`Element ${item.nodeName} ${item.id != "" ? `With ID: ${item.id} ` : ""}doesn't have the "data-value" attribute and so is unable to be affected by the RandomizedLetters Effect`);
            return;
        }
        item.addEventListener("mouseenter", e => {
            const startingLetters = e.target.dataset.value;

            let i = 0;
            const randomizeInterval = setInterval(() => {
                if (i > startingLetters.length * iterationsPerLetter)
                    clearInterval(randomizeInterval);

                e.target.innerText = startingLetters.split("")
                    .map((c, cIndex) => cIndex * iterationsPerLetter < i ? startingLetters[cIndex] : lettersForRandomization[Math.floor(Math.random() * 25)])
                    .join("");
                i++;
            }, 1000 / iterationsPerSecond)
        });
    });
}

export function AddBlobEffectToMouse(blobID = "blob", speed = 5000) {
    const blob = document.querySelector(`#${blobID}`);
    document.body.onpointermove = e => {
        blob.animate(
            {
                left: `${e.x}px`,
                top: `${e.y}px`
            }, { duration: speed, fill: 'forwards' }
        );
    };
}