function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; expires=" + date.toUTCString() +
        "; path=/";
}


const savedName = getCookie("username");
const farmTitle = document.getElementById("farmTitle");
const nameInput = document.getElementById("nameInput");
const nameForm = document.getElementById("nameForm");

if (savedName) {
    farmTitle.textContent = `${savedName}'s Farm`;
    nameForm.style.display = "none";
}

document.getElementById("saveName").addEventListener("click", () => {
    const nameValue = nameInput.value.trim();
    if (!nameValue) return;

    setCookie("username", nameValue, 30);
    farmTitle.textContent = `${nameValue}'s Farm`;
    nameForm.style.display = "none";
});

const woolDisplay = document.getElementById("woolDisplay");
const sheep = document.getElementById("sheep");

fetch("/api/game")
    .then(res => res.json())
    .then(game => {
        woolDisplay.textContent = game.wool;
    });

sheep.addEventListener("click", () => {
    fetch("/api/click", { method: "POST" })
        .then(res => res.json())
        .then(game => {
            woolDisplay.textContent = game.wool;
        });
});
function buySheep(cost, power, type) {
    fetch("/api/upgrade", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cost: cost,
            woolPerClick: power,
            sheep: type
        })
    })
    .then(res => res.json())
    .then(data => {
        woolDisplay.textContent = data.wool;
        sheep.src = `images/sheep_${data.sheep}.png`;
    });
}

function resetGame() {
    fetch("/api/game", { method: "DELETE" })
        .then(res => res.json())
        .then(data => {
            woolDisplay.textContent = data.wool;
            sheep.src = "images/sheep_basic.png";
        });
}
