const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

const user1 = new User({
  username: "user1",
  availability: [
    {
      weekNumber: 1,
      availableDays: [
        { day: "Mon" },
        { day: "Tue" },
        { day: "Wed" },
        { day: "Thu" },
        { day: "Fri" },
      ],
    },
    {
      weekNumber: 2,
      availableDays: [
        { day: "Tue" },
        { day: "Wed" },
        { day: "Thu" },
        { day: "Fri" },
      ],
    },
    {
      weekNumber: 3,
      availableDays: [{ day: "Wed" }, { day: "Thu" }, { day: "Fri" }],
    },
    {
      weekNumber: 4,
      availableDays: [{ day: "Thu" }, { day: "Fri" }],
    },
    {
      weekNumber: 5,
      availableDays: [{ day: "Mon" }, { day: "Tue" }, { day: "Wed" }],
    },
    {
      weekNumber: 6,
      availableDays: [
        { day: "Mon" },
        { day: "Tue" },
        { day: "Wed" },
        { day: "Thu" },
      ],
    },
    {
      weekNumber: 7,
      availableDays: [{ day: "Mon" }, { day: "Tue" }],
    },
  ],
});

user1.save().then(() => {
  console.log("User saved");
});

app.get("/users/:username/availability", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ availability: user.availability });
  } catch (error) {
    console.error("Error fetching user availability:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users/:username/availability", async (req, res) => {
    const { username } = req.params;
    const {updates}  = req.body;
    console.log(updates)
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      updates.forEach((update) => {
        const { weekNumber, availableDays } = update;
      
        if (!weekNumber || !Number.isInteger(weekNumber)) {
          return res.status(400).json({ message: "Invalid weekNumber provided" });
        }
      
        const index = user.availability.findIndex((week) => week.weekNumber === weekNumber);
      
        if (index !== -1) {
            user.availability[index].availableDays = availableDays;
          }
      });
  
      await user.save();
  
      res.json({ message: "Availability updated successfully", updatedAvailability: user.availability });
    } catch (error) {
      console.error("Error updating user availability:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.use((req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
