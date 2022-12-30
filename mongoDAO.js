// imports the MongoClient that accesses the local MongoDB server
const { MongoClient, Db } = require('mongodb');
// The Local Database to work on 
var db;
// The particular collection in the database
var coll;

// Set up the connection to the local MongoDB Server at port 27017 (MongoDB default port number)
MongoClient.connect('mongodb://localhost:27017')
.then((client) => {
    db = client.db('employeesDB');
    coll = db.collection('employees');
    console.log('Connection established')
})
.catch((error) => {
    console.log('connection failed', error)
});

/**
 * This method searches and returns all document contained on the 'employees' collection
 * @returns {Promise} A promise based result of the MongoDB search.
 */
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

/**
 * This method updates the 'employees' collection in the MongoDB database. It inserts a new document
 * that represents an employee in the database. 
 * @param {Object} param - Information about the employee
 * @param {String} param._id - The unique identification code of the employee. 
 * @param {String} param.phone - The phone number of the employee
 * @param {String} param.email - The Email of the employee
 * @returns {Promise}  A promise based result of the MongoDB insertion. 
 */
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