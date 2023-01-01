// Use Promise based MySQL
const pMysql = require('promise-mysql');
// Represents a MySQL connection, fromm which queries are run
var connection;
pMysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proj2022'
}).then(p => {
    connection = p;
}).catch(e => {
    console.log('Pool Error');
});







/**
 * This method queries the MySQL database for the list of employees records. 
 * @param {Request} req - The HTML Request.
 * @param {Number} [req.params.select] - Indicating whether the request will be sorted in a specified column index.  
 * @returns {Promise} A promise based result from MySQL query on the 'employee' table
 */
var getEmployeesSQL = function (req) {
    // list of possible columns to use as sort criteria
    var emplSQLCols = ['eid', 'ename', 'role', 'salary'];
    // default to the first column
    let col = 0;
    let from = emplSQLCols[col];
    if (req.params.select) { // Check if an extrap parameter was specified in the url
        if (req.params.select >= 0 && req.params.select < 4) { // Check if parameter is within acceptable range
            console.log('found select', req.params.select);
            from = emplSQLCols[req.params.select];
            col = req.params.select;
        }
    }
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM employee ORDER BY ${from} ASC`)
            .then((data) => {
                //                console.log({col: emplSQLCol, order: emplSQLOrder, data: data});
                resolve({ col: col, data: data, });
            })
            .catch((error) => {
                reject(error);
            })
    })
}




/**
 * This method queries the database for the information of a particular employee. The employee's record to be fetched is 
 * identified with  the parameter 'eid'.
 * @param {String} eid - The unique identification number of the emloyee' s records to be fetched
 * @returns {Promise} A promise based result from MySQL query on the 'employee' table
 */

var getEmployeeSQL = function (eid, res) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM employee WHERE eid = '${eid}'`)
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    });
}

/**
 * This method queries the 'dept' and 'location' tables to get all information associated with a department. 
 * The location id - 'lid' on both tables are used as the foreign key in the MySQL join operation.
 * @returns {Promise} A promise based result from MySQL query.
 */
var getDepartmentsSQL = function () {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT D.did as did, D.dname as dname, D.budget as budget, L.county as location FROM dept as D inner join location as L on D.lid = L.lid`)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

/**
 * This method runs an update query on the MySQL database to update the information of a given employee. 
 * @param {Object} param - Contains information to be updated on the 'employee' table
 * @param {String} param.id - The unique identification code of the employee's information to be updated
 * @param {String} param.ename - The name of the employee
 * @param {String} param.role - The role of the employee
 * @param {Number} param.salary - The salary of the employee
 * @returns {Promise} A promise based result of the MySQL query.
 */
var updateEmployeeSQL = function (param) {
    return new Promise((resolve, reject) => {
        /* 
        Swaps the first element of the array with the last element so the param from the HTML form
        is in the same form as as in the database.
        */
        const [kFirst, ...keys] = Object.keys(param);
        keys.push(kFirst);
        const [vFirst, ...body] = Object.values(param);
        body.push(vFirst);

        let str = pMysql.format(`UPDATE employee SET ${keys[0]} = ?, ${keys[1]} = ?, ${keys[2]} = ? WHERE ${keys[3]} = ?`, Object.values(body));
        console.log("Check this", str);

        connection.query(`UPDATE employee SET ${keys[0]} = ?, ${keys[1]} = ?, ${keys[2]} = ? WHERE ${keys[3]} = ?`, Object.values(body))
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                reject(data);
            })
    })
}

/**
 * This method deletes a given department from the MySQL database.
 * @param {Object} param - Contains  information about the department to be deleted from the MySQL database
 * @param {String} param.id - The unique identification code of the department to be deleted
 * @returns {Promise} A promise based result of the MySQL query.
 */
var deleteDepartmentSQL = function (param) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM dept WHERE did = '${param.did}'`)
            .then((data) => {
                console.log("Result", data);
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
    })

}

/**
 * This method queries the MySQL database with id supplied from the MongoDB database to check if it exist on the MySQL database. 
 * @param {Object} param - Contains information about the employee's information to be fetched on the MongoDB database
 * @param {String} param._id - The unique identification code of the employee on the MongoDB database. 
 * @returns {Promise} A promise based result of the MySQL query.
 */
var findEmployeeSQL = function (param) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM employee WHERE eid='${param._id}'`)
            .then((data) => {
                if (data.length > 0) {
                    resolve({ found: true });
                } else {
                    reject({ found: false, msg: `Employee width id '${param._id}' does not exist in MySQL Database` })
                }
            })
            .catch((error) => {
                reject({ found: false, msg: error });
            })
    })
}






module.exports = { getEmployeesSQL, getDepartmentsSQL, getEmployeeSQL, updateEmployeeSQL, deleteDepartmentSQL, findEmployeeSQL }