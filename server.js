const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const sheepProperties = [
    {
        name: "Fluffy Sheep",
        woolPerClick: 10,
        cost: 20,
        image: 'sheep_fluffy.png',
    },
    {
        name: "Silver Sheep",
        woolPerClick: 20,
        cost: 40,
        image: 'sheep_silverr.png',
        
    },
    {
        name: "Golden Sheep",
        woolPerClick: 40,
        cost: 80,
        image: 'sheep_golden.png',
    },
    {
        name: "Jester Sheep",
        woolPerClick: 80,
        cost: 160,
        image: 'sheep_jester.png',
    },

    {
        name: "King Sheep",
        woolPerClick: 160,
        cost: 320,
        image: 'sheep_king.png',
    },
];

const games = {};

app.get("/api/sheep", (req, res) => {
    res.json(sheepProperties);
});

app.get("/api/games", (req, res) => {
    res.json(games);
});

app.get("/api/game", (req, res) => {
    const username = req.cookies.username;
    if (username in games) {
        // Exisiting user
        res.json(games[username]);
    } else {
        // New user
        var game = {wool: 0, collections: 0, sheep: sheepProperties[0]};
        games[username] = game;
        res.json(game);
    }  
});

app.put("/api/collect", (req, res) => {
    const username = req.cookies.username;
    if (username in games) {
        var game = games[username];
        game.wool += game.sheep.woolPerClick;
        game.collections++;
        res.json(game);
        return;
    }
    res.sendStatus(404);
});

app.post("/api/buy/:index", (req, res) => {
    const username = req.cookies.username;
    if (username in games) {
        var game = games[username];
        var sheep = sheepProperties[req.params.index];
        if (game.wool >= sheep.cost) {
            game.wool -= sheep.cost;
            game.sheep = sheep;
            res.json(game);
        } else {
            res.status(400).json({message: `Insufficient wool to buy ${sheep.name}`});
        }
        return;
    }
    res.sendStatus(404);  
});

// The secret end points to reset all games.
// Go to page http://localhost:3000/api/reset in browser 
// to delete all game data.
app.get("/api/reset", (req, res) => {
    Object.keys(games).forEach(key => {
        delete games[key];
    });
    res.sendStatus(200);
});

app.delete("/api/deletegame", (req, res) => {
    const username = req.cookies.username;
    if (username in games) {
        delete games[username];
    }
    res.sendStatus(200);
});

app.delete("/api/delete", (req, res) => {
    const username = req.query.user;
    if (username in games) {
        delete games[username];
    }
    res.json(games);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
