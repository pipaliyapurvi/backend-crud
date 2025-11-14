// server.js
const express = require("express");
const server = express();
const mongoose = require("mongoose");

// EJS view engine set કરો
server.set("view engine", "ejs");

// Body parsing middleware (POST form માટે)
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// MongoDB connect
mongoose
  .connect("mongodb://localhost:27017/mongooseCrud")
  .then(() => console.log(" MongoDB connection success"))
  .catch((err) => console.log(" DB Error:", err));

// Model import
const USER = require("./model/user");

//  HOME + SEARCH
server.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const filter = search
  ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },

        // Convert number to string before regex
        { phone: { $regex: new RegExp(search, "i") } }

      ],
    }
  : {};


    const allData = await USER.find(filter).lean();

  res.render("crud", { allData, searchValus : search });

  } catch (err) {
    console.log(err);
    res.send("Error loading data");
  }
});

// ADD + UPDATE (same route)
// form method="POST" action="/crudData"
server.post("/crudData", async (req, res) => {
  try {
    const { id, name, username, phone, email } = req.body;

    if (id && id.trim() !== "") {
      // UPDATE
      await USER.findByIdAndUpdate(id, {
        name,
        username,
        phone,
        email,
      });
    } else {
      // CREATE
      await USER.create({
        name,
        username,
        phone,
        email,
      });
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error saving data");
  }
});




//  DELETE
server.get("/deleteData/:id", async (req, res) => {
  try {
    await USER.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error deleting data");
  }
});

//  SERVER START
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
