const pMysql = require('promise-mysql');
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
/* 
 ; */

var getEmployeesSQL = function () {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employee')
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

var getDepartments = function(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM dept')
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}





module.exports = { getEmployeesSQL, getDepartments }