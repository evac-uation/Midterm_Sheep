//Get cookie
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

//Set cookie
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
//extract difficulty value
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

//Adjust sheep size according to difficulty
if (difficulty == 'hard') {
    sheep.style.scale=0.5;
    document.getElementById("hard").checked = true;
} else {
    sheep.style.scale=1;
    document.getElementById("normal").checked = true;
}

if (savedName) {
    //username already exists in cookie
    farmTitle.textContent = `${savedName}'s Farm`;
    nameForm.style.display = "none";
    resetName.style.display = "block";
    deleteGame.style.display = "block";
    loadGame();
} else {
    //no username
    nameForm.style.display = "block";
    resetName.style.display = "none";
    deleteGame.style.display = "none";
    woolDisplay.textContent = "0";
}

//when saveName button is clicked
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

//when resetName button is clicked
resetName.addEventListener("click", () => {
    setCookie("username", '');
    nameForm.style.display = "block";
    resetName.style.display = "none";
    window.location.reload();
});

//game status
var game = null;

//normal difficulty
function setNormal() {
    sheep.style.scale=1;
}

//hard difficulty
function setHard() {
    sheep.style.scale=0.5;
}

//get sheep types from server and populate table
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

//get status of current user
async function loadGame() {        
    const response = await fetch('/api/game');
    const data = await response.json();
    game = data;
    woolDisplay.textContent = data.wool;
    sheepDisplay.textContent = data.sheep.name;
    perClickDisplay.textContent = data.sheep.woolPerClick;
    collectionDisplay.textContent = data.collections;
}

//delete current player
async function deleteCurrentGame() {
    const response = await fetch("/api/deletegame", { method: "DELETE"});
    setCookie("username", '');
    nameForm.style.display = "block";
    resetName.style.display = "none";
    deleteGame.style.display = "none";
    window.location.reload();
}

//when user clicks the sheep to collect wool
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

//when user buys sheep
async function buySheep(index) {
    const response = await fetch(`/api/buy/${index}`, { method: "POST"});
    if (response.status === 200) {
        const data = await response.json();
        game = data;
        woolDisplay.textContent = data.wool
        sheepDisplay.textContent = data.sheep.name;
        perClickDisplay.textContent = data.sheep.woolPerClick;
        sheep.src=`images/${data.sheep.image}`;
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message);
    }
}

loadSheep();