const express = require("express");
const app = express();
const port = 3004;

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});