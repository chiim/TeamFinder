
const Sequelize = require('sequelize')



module.exports = function ({ initPostgres }) {


    const sequelize = new Sequelize('databaseORM', 'user', 'root', {
        host: 'database',
        dialect: 'postgres',
        database: 'databaseORM'
    })

    return sequelize
        .authenticate()
        .then(() => {

            return initPostgres.initDb(sequelize, Sequelize).then(function (tables) {

                console.log('Connection has been established successfully.');

                return tables
            })
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return sequelize
        });





}