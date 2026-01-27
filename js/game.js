function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
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

    const expiry = new Date();
    expiry.setTime(expiry.getTime() + 30 * 24 * 60 * 60 * 1000);

    document.cookie =
        "username=" + encodeURIComponent(nameValue) +
        "; expires=" + expiry.toUTCString() +
        "; path=/";

    farmTitle.textContent = `${nameValue}'s Farm`;
    nameForm.style.display = "none";
});

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(express.static('public'));

let sheepList = [];
let nextId = 1;

app.get('/api/sheep', (req, res) => {
    res.json(sheepList);
});

app.get('/api/sheep/:id', (req,res) => {
    const sheep = sheepList.find(s => s.id === parseInt(req.params.id));
    if (!sheep) return res.status(404).json({error: 'Sheep not found'});
    res.json(sheep);
})

app.post('/api/sheep', (req, res) => {
    const { name, woolPerClick = 1 } = req.body;

})