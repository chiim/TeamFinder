const mySql = require('mysql')

const db = mySql.createConnection({
    host: 'database',
    user: 'root',
    password: 'user',
    database: 'database'
})

db.connect(function(error){

  var createTable = `CREATE TABLE accounts (
      accountId INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(50), 
      email VARCHAR(50),
      age VARCHAR(3),
      phoneNr VARCHAR(15),
      city VARCHAR(30),
      gender VARCHAR(10)
      )`  

    db.query(createTable, function(error){
        console.log(error)
        console.log("create table!")
    })

})

