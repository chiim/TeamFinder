const mysql   = require('mysql')

const connection = mysql.createConnection({
	host     : 'database',
	user     : 'root',
	password : 'user',
	database : 'database'
})

module.exports = connection