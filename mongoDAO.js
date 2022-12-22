const { MongoClient, Db } = require('mongodb');

const mongoDAO = require('mongodb').MongoClient


var db;
var coll;

MongoClient.connect('mongodb://localhost:27017')
.then((client) => {
    db = client.db('employeesDB');
    coll = db.collection('employees');
    console.log('Connection established')
})
.catch((error) => {
    console.log('connection failed', error)
});


const getEmployeesMDB = function(){
    return new Promise((resolve, reject) => {
        var cursor = coll.find();
        cursor.toArray()
        .then((documents) =>{
            console.log('then findall', documents);
            resolve(documents)
        })
        .catch((error) => {
            console.log('catch', error);
            reject(error);
        })
    })
}

const addEmployeeMDB = function(param) {
    return new Promise((resolve, reject) => {
        coll.insertOne(param)
        .then((result) => {
            resolve({added: true, _id: result.insertId});
        })
        .catch((error) => {
 //           console.log(error);
            reject({added: false, msg: `Employee with Id '${param._id}' already exist in MongoDB`});
        })
    })
}
module.exports = {getEmployeesMDB, addEmployeeMDB}