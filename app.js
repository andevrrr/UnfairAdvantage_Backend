const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

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


