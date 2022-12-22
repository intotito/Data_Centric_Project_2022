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

var getDepartmentsSQL = function(){
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





module.exports = { getEmployeesSQL, getDepartmentsSQL, getEmployeeSQL, updateEmployeeSQL }