const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const port = 3002;

const Items = require("./models/itemSchema");

const mongoURI = "mongodb://localhost:27017/stuff";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

connectToMongo();

// A list of routes
// individualItem - for viewing a certain item and all its info - tags, notes, purchase price
// tags - for viewing a list of the tags. The page includes edit and delete buttons for editing
// and deleting the tags. individualTag - for viewing a list of items that have a certain tag.
// There are edit and delete buttons for editing and deleting tags.

//INDUCES

//LANDING
app.get("/", (req, res) => {
  res.render("landing.ejs");
});

//INDEX
app.get("/stuff", async (req, res) => {
  try {
    const items = await Items.find({});
    res.render("index.ejs", {
      items:items
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//NEW
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

//DELETE
app.delete("/stuff/:id", async (req, res) => {
  try {
    await Items.findByIdAndDelete(req.params.id);
    res.redirect("/stuff");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//UPDATE
app.put("/stuff/:id", async (req, res) => {
  if (req.body.isBroken === "on") {
    req.body.isBroken = true;
  } else {
    req.body.isBroken = false;
  }
  if (req.body.wrongSize === "on") {
    req.body.wrongSize = true;
  } else {
    req.body.wrongSize = false;
  }

  try {
    const item = await Items.findById(req.params.id, req.body, {
      new: true,
    });
    res.redirect("/stuff");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

  res.send(req.body);
});

//CREATE
app.post("/stuff/new", async (req, res) => {
  console.log("This is the Stuff New route")

  if (req.body.broken === "on") {
    req.body.broken = true;
  } else {
    req.body.broken = false;
  };
  if (req.body.wrongSize === "on") {
    req.body.wrongSize = true;
  } else {
    req.body.wrongSize = false;
  };
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(",");
  }

  const newItem = await Items.create(req.body);
  res.redirect("/stuff");
  });

//EDIT
app.get("/stuff/:id/edit", async (req, res) => {
  console.log("req.params.id", req.params.id);
  try {
    const item = await Items.findById(req.params.id);
    res.render("edit.ejs", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//SHOW
app.get("/stuff/:id", async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    res.render("show.ejs", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
