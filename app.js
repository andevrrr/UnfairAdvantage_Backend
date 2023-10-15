const express = require('express');
require("dotenv").config();

const app = express();

app.use((req, res) => {
    res.send("Hello World");
})

app.listen(3000);

