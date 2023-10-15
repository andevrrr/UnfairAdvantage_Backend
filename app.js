const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const User = require('./models/user');
const app = express();

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

const user1 = new User({
    username: 'user1',
    availability: [
    {
      weekNumber: 1,
      availableDays: [
        { day: 'Mon' },
        { day: 'Tue' },
        { day: 'Wed' },
        { day: 'Thu' },
        { day: 'Fri' },
      ],
    },
    {
        weekNumber: 2,
        availableDays: [
          { day: 'Tue' },
          { day: 'Wed' },
          { day: 'Thu' },
          { day: 'Fri' },
        ],
      },
      {
        weekNumber: 3,
        availableDays: [
          { day: 'Wed' },
          { day: 'Thu' },
          { day: 'Fri' },
        ],
      },
      {
        weekNumber: 4,
        availableDays: [
          { day: 'Thu' },
          { day: 'Fri' },
        ],
      },
      {
        weekNumber: 5,
        availableDays: [
          { day: 'Mon' },
          { day: 'Tue' },
          { day: 'Wed' }
        ],
      },
      {
        weekNumber: 6,
        availableDays: [
          { day: 'Mon' },
          { day: 'Tue' },
          { day: 'Wed' },
          { day: 'Thu' }
        ],
      },
      {
        weekNumber: 7,
        availableDays: [
          { day: 'Mon' },
          { day: 'Tue' }
        ],
      },
  ],
})

user1.save().then(() => {
    console.log('User saved');
  });

app.use((req, res) => {
    res.send("Hello World");
})

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });


