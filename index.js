const express = require('express');
const mysql = require('./mySqlDAO')
const app = express();
const PORT = 3004;
const mongoDAO = require('./mongoDAO')
const ejs = require('ejs')


app.set('view engine', 'ejs')
app.listen(3004, () => {
    console.log("Server Listening on Port", PORT);
});