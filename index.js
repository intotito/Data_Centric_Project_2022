// Create an Express Application
const express = require('express');
const mysql = require('./mySqlDAO')
const app = express();

// Port where the Express Server will be running
const PORT = 3004;

// Import mongodb querry function from specified file 
const mongodb = require('./mongoDAO')
const ejs = require('ejs')

// Set the Application's default View Engine to EJS
app.set('view engine', 'ejs')

// Start listening at specified Port Number
app.listen(PORT, () => {
    console.log("Server Listening on Port", PORT);
});

// Using middleware to encode url for post parsing
app.use(express.urlencoded({
    extended: true
}))

// Handle HTTP GET request at '/'
app.get('/', (req, res) => {
    // Render home page
    res.render('home');
})



// Handle HTTP GET request at '/employees' with optional parameter 'select' for ordering the query result from MySQL
app.get('/employees/:select?', (req, res) => {
    mysql.getEmployeesSQL(req)
        .then((data) => {

            // render EJS file name 'employees.ejs' with specified parameters
            res.render('employees', {employees: data.data, col: data.col});
        }).catch((error) => {
            res.send(error);
        })
});

// Handle HTTP GET request at '/departments'
app.get('/departments', (req, res) => {
    mysql.getDepartments()
        .then((data) => {
            res.send(data);
        }).catch((error) => {
            res.send(error);
        })
});

// Handle HTTP GET request at '/emplooyees/edit/' with parameter 'eid'
app.get('/employees/edit/:eid', (req, res) => {
    console.log("Did we get here?");
    mysql.getEmployeeSQL(req.params.eid.substring(1,))
        .then((data) => {
            console.log(data[0]);
            res.render('edit', {emp: data[0]});
        }).catch((error) => {
            res.send(error);
        })
});

// Handle HTTP POST request at '/employees/edit/' with parameter 'eid'
app.post('/employees/edit/:eid', (req, res) => {
    console.log("This is the body", req.body);
    mysql.updateEmployeeSQL(req.body)
    .then((data) => {
        console.log(data);
        // Redirect to '../../employees' if update successful
        res.redirect('../../employees');
    }).catch((error) => {
        res.send(error);
    })
})

// Handle HTTP GET request at '/depts'
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

// Handle HTTP GET request at '/depts/delete' with parameter 'did'
app.get('/depts/delete/:did', (req, res) => {
    mysql.deleteDepartmentSQL({did: req.params.did.substring(1,)})
    .then((data) => {
        // Redirect user to '/depts' if successfull
        res.redirect('/depts');
    })
    .catch((error) => {
        // Render Errom message with relevant messages to the user if deletion attempt fails. 
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

// Handle HTTP GET request at '/employeesmdg'
app.get('/employeesmdb', (req, res) => {
    mongodb.getEmployeesMDB()
    .then((data) => {
        res.render('employeesMDB', {employees: data});
    }).catch((error) => {
        res.send(error)
    })
});

// Handle HTTP GET request at '/employees/mongoDB/add'
app.get('/employees/mongoDB/add', (req, res) => {
    // Renders the 'add-employee-mb' form to the user.
    res.render('add-employee-mdb');
});

// Handle HTTP POST request at '/employees/mongoDB/add'
app.post('/employees/mongoDB/add', (req, res) => {
    mysql.findEmployeeSQL(req.body)
    .then((data) => {

        mongodb.addEmployeeMDB(req.body)
        .then((data) => {
            if(data.added === true){
                // Redirect user to '/employeesmdb' if successfull.
                res.redirect('/employeesmdb')
            } else {
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