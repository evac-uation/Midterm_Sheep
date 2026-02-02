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

// get the query string from the current URL
const queryString = window.location.search;
//parse the paraemeters
const urlParams = new URLSearchParams(queryString);
//extract specific values
const difficulty = urlParams.get('difficulty');


const savedName = getCookie("username");
const farmTitle = document.getElementById("farmTitle");
const resetName = document.getElementById("resetName");
const deleteGame = document.getElementById("deletegame");
const nameInput = document.getElementById("nameInput");
const nameForm = document.getElementById("nameForm");

var sheepProperties = [];
var user = {}

const woolDisplay = document.getElementById("woolDisplay");
const sheepDisplay = document.getElementById("sheepDisplay");
const perClickDisplay = document.getElementById("perClickDisplay");
const collectionDisplay = document.getElementById("collectionDisplay");
const sheep = document.getElementById("sheep");

if (difficulty == 'hard') {
    sheep.style.scale=0.5;
}

if (savedName) {
    farmTitle.textContent = `${savedName}'s Farm`;
    nameForm.style.display = "none";
    resetName.style.display = "block";
    deleteGame.style.display = "block";
    loadGame();
} else {
    nameForm.style.display = "block";
    resetName.style.display = "none";
    deleteGame.style.display = "none";
    woolDisplay.textContent = "0";
}

document.getElementById("saveName").addEventListener("click", () => {
    const nameValue = nameInput.value.trim();
    if (!nameValue) return;

    setCookie("username", nameValue, 30);
    farmTitle.textContent = `${nameValue}'s Farm`;
    nameForm.style.display = "none";
    resetName.style.display = "block";
    deleteGame.style.display = "block";
    loadGame();
});

resetName.addEventListener("click", () => {
    setCookie("username", '');
    nameForm.style.display = "block";
    resetName.style.display = "none";
    window.location.reload();
});

var game = null;

function setNormal() {
    sheep.style.scale=1;
}

function setHard() {
    sheep.style.scale=0.5;
}

async function loadSheep() {        
    const response = await fetch("/api/sheep");
    const data = await response.json();
    var tableHtml = '';
    data.forEach((item, index) => {
        const rowHtml = `<tr><td><button onclick = "buySheep(${index})">${item.name}</button></td><td>${item.woolPerClick}</td><td>${item.cost}</td></tr>`;
        tableHtml += rowHtml;
    });
    const tableBody = document.getElementById('sheepTable');
    tableBody.innerHTML = tableHtml;
}

async function loadGame() {        
    const response = await fetch('/api/game');
    const data = await response.json();
    game = data;
    woolDisplay.textContent = data.wool;
    sheepDisplay.textContent = data.sheep.name;
    perClickDisplay.textContent = data.sheep.woolPerClick;
    collectionDisplay.textContent = data.collections;
}

async function deleteCurrentGame() {
    const response = await fetch("/api/deletegame", { method: "DELETE"});
    setCookie("username", '');
    nameForm.style.display = "block";
    resetName.style.display = "none";
    deleteGame.style.display = "none";
    window.location.reload();
}


async function collectWool() {
    const response = await fetch("/api/collect", { method: "PUT"});
    if (response.status === 200) {
        const data = await response.json();
        game = data;
        woolDisplay.textContent = data.wool;
        collectionDisplay.textContent = data.collections;
    }
}

sheep.addEventListener("click", collectWool);

async function buySheep(index) {
    const response = await fetch(`/api/buy/${index}`, { method: "POST"});
    if (response.status === 200) {
        const data = await response.json();
        game = data;
        woolDisplay.textContent = data.wool
        sheepDisplay.textContent = data.sheep.name;
        perClickDisplay.textContent = data.sheep.woolPerClick;
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message);
    }
}

loadSheep();