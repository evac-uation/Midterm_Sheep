const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));


let game = {
    wool: 0,
    woolPerClick: 1,
    sheep: "basic"
};

app.get("/api/game", (req, res) => {
    res.json(game);
});

app.post("/api/click", (req, res) => {
    game.wool += game.woolPerClick;
    res.json(game);
});

app.put("/api/upgrade", (req, res) => {
    const { cost, woolPerClick, sheep } = req.body;

    if (game.wool < cost) {
        return res.status(400).json({ error: "Not enough wool" });
    }

    game.wool -= cost;
    game.woolPerClick = woolPerClick;
    game.sheep = sheep;

    res.json(game);
});

app.delete("/api/game", (req, res) => {
    game = {
        wool: 0,
        woolPerClick: 1,
        sheep: "basic"
    };
    res.json(game);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});