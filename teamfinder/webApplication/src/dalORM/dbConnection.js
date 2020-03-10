const initPostgres = require('./initPostgres')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('databaseORM', 'user', 'root', {
    host: 'database',
    dialect: 'postgres',
    database: 'databaseORM'
})

const tryToAuth = function (sequelize) {
    sequelize
        .authenticate()
        .then(() => {
            initPostgres(sequelize, Sequelize).then(function (tables) {
                console.log('Connection has been established successfully.');
                clearInterval(interval)
                getConnection = sequelize
                //return sequelize
            })
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            //return sequelize
        });
    //return sequelize
}
//var getConnection = null

var interval = setInterval(tryToAuth, 1000, sequelize)

module.exports = sequelize

