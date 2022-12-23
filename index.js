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

app.get('/depts', (req, res) => {
    mysql.getDepartmentsSQL()
    .then((data) => {
        console.log(data);
        res.render('departments', {depts: data});
    })
    .catch((error) => {
        console.log(error);
        res.send(error);
    })
})

app.get('/depts/delete/:did', (req, res) => {

    mysql.deleteDepartmentSQL({did: req.params.did.substring(1,)})
    .then((data) => {
        console.log("Odogwu", data);
        res.redirect('/depts');
    })
    .catch((error) => {
        res.render('error',
            {
                error:{
                    title: 'Delete Error', 
                    msg: `Department '${req.params.did.substring(1,)}' has Employees and cannot be deleted'`
                }
            }
        );
    })
})

app.get('/employeesmdb', (req, res) => {
    mongodb.getEmployeesMDB()
    .then((data) => {
        res.render('employeesMDB', {employees: data});
    }).catch((error) => {
        res.send(error)
    })
});

app.get('/employees/mongoDB/add', (req, res) => {
    res.render('add-employee-mdb');
});

app.post('/employees/mongoDB/add', (req, res) => {
    mysql.findEmployeeSQL(req.body)
    .then((data) => {
        console.log("Checko", req.body);
        mongodb.addEmployeeMDB(req.body)
        .then((data) => {
            if(data.added === true){
                res.redirect('/employeesmdb')
            } else {
                console.log("Are you rendering errors");
                res.render('error', {error:{title: 'Create Error', msg:data.msg}})
            }
        })
        .catch((error) => {
            console.log(error);
            res.render('error', {error:{title: 'Create Error', msg:error.msg}})
        })
    })
    .catch((error) => {
        res.render('error', {error:{title: 'Create Error', msg:error.msg}});
    })
})