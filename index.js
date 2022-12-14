const express = require('express');
const mysql = require('./mySqlDAO')
const app = express();
const PORT = 3004;
const mongodb = require('./mongoDAO')
const ejs = require('ejs')


app.set('view engine', 'ejs')
app.listen(3004, () => {
    console.log("Server Listening on Port", PORT);
});

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/employees', (req, res) => {
    mysql.getEmployeesSQL()
        .then((data) => {
            res.render('employees', {employees: data});
        }).catch((error) => {
            res.send(error);
        })
});
app.get('/departments', (req, res) => {
    mysql.getDepartments()
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            res.send(error);
        })
});
app.get('/employeesmdb', (req, res) => {
    mongodb.getEmployeesMDB()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    })
});