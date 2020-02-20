const mysql   = require('mysql')

module.exports = function(){

const connection = mysql.createConnection({
	host     : 'database',
	user     : 'root',
	password : 'user',
	database : 'database'
})
	return connection
}

//module.exports = connection