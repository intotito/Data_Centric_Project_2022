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

// Using middleware to encode url for post parsing
app.use(express.urlencoded({
    extended: true
}))

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

app.get('/employees/edit/:eid', (req, res) => {
    mysql.getEmployeeSQL(req.params.eid.substring(1,))
        .then((data) => {
            console.log(data[0]);
            res.render('edit', {emp: data[0]});
        }).catch((error) => {
            res.send(error);
        })
});

app.post('/employees/edit/:eid', (req, res) => {
    console.log("This is the body", req.body);
    mysql.updateEmployeeSQL(req.body)
    .then((data) => {
        console.log(data);
        res.redirect('../../employees');
    }).catch((error) => {
        res.send(error);
    })
})


app.get('/employeesmdb', (req, res) => {
    mongodb.getEmployeesMDB()
    .then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send(error);
    })
});