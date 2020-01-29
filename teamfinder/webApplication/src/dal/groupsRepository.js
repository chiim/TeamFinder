const mySql = require('mysql')

const db = mySql.createConnection({
    host: 'database',
    user: 'root',
    password: 'user',
    database: 'database'
})

db.connect(function(error){

    var createTable = `CREATE TABLE IF NOT EXISTS groups(
        groupId INT AUTO_INCREMENT PRIMARY KEY,
    )`

})