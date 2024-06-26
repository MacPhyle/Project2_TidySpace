const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const port = 3002;

const Items = require("./models/itemSchema");

const mongoURI = "mongodb://localhost:27017/stuff";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

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
      items: items,
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

//CREATE
app.post("/stuff/new", async (req, res) => {
try {
  if (req.body.broken === "on") {
    req.body.broken = true;
  } else {
    req.body.broken = false;
  }
  if (req.body.wrongSize === "on") {
    req.body.wrongSize = true;
  } else {
    req.body.wrongSize = false;
  }
  if (req.body.tags) {
    req.body.tags = req.body.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "")
  }
  const newItem = await Items.create(req.body);
  res.redirect("/stuff");
} catch (err) {
  console.error("Error creating new item:", err)
  res.status(500).send("Internal Server Error");
}
});

app.get("/tags", async (req, res) => {
  try {
    const items = await Items.find({});
    let allTags = [];

    items.forEach(item => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          allTags = allTags.concat(tag.split(","));
        });
      } else if (typeof item.tags === "string") {
        allTags = allTags.concat(item.tags.split(","));
      }
    });

    const cleanedTags = allTags
    .map(tag => tag.trim())
    .filter(tag => tag !== "");

    res.render("tags.ejs", { tags: cleanedTags });
  } catch (err) {
    console.error("Error in /tags route:", err);
    res.status(500).send("Internet Server Error");
  }
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
  if (req.body.broken === "on") {
    req.body.broken = true;
  } else {
    req.body.broken = false;
  }
  if (req.body.wrongSize === "on") {
    req.body.wrongSize = true;
  } else {
    req.body.wrongSize = false;
  }

  try {
    await Items.findByIdAndUpdate(req.params.id, req.body, {});
    res.redirect("/stuff");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//EDIT
app.get("/stuff/:id/edit", async (req, res) => {
  try {
    const itemID = req.params.id;
    const item = await Items.findById(itemID);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    res.render("edit.ejs", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/tags/:tag", async (req, res) => {
  try {
    const tag = req.params.tag;

    const items = await Items.find({ tags: { $regex: new RegExp(tag, "i") } });

    res.render("indTag.ejs", { items, tag });
  } catch (err) {
    console.error("Error in /tags/:tag route:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/stuff/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(404).send("Invalid item ID");
    }
    const item = await Items.findById(id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("show.ejs", { item });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
