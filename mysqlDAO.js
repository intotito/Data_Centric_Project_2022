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

var getEmployeeSQL = function(eid) {
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

var updateEmployeeSQL = function(param){
    return new Promise((resolve, reject) => {
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





module.exports = { getEmployeesSQL, getDepartments, getEmployeeSQL, updateEmployeeSQL }