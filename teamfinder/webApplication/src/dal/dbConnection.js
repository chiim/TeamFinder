const mysql   = require('mysql')

module.exports = function(){

const connection = mysql.createConnection({
	host     : 'mysqldatabase',
	user     : 'root',
	password : 'user',
	database : 'database'
})
	return connection
}
