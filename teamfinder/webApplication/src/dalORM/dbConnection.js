
const Sequelize = require('sequelize')



module.exports = function ({ initPostgres }) {


    const sequelize = new Sequelize('databaseORM', 'user', 'root', {
        host: 'database',
        dialect: 'postgres',
        database: 'databaseORM'
    })

    sequelize
        .authenticate()
        .then(() => {

            initPostgres.initDb(sequelize, Sequelize).then(function (tables) {

                console.log('Connection has been established successfully.');
                return sequelize
            })
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return sequelize
        });    
        return sequelize


}