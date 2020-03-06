
const Sequelize = require('sequelize')



module.exports = function ({ initPostgres }) {


    const sequelize = new Sequelize('databaseORM', 'user', 'root', {
        host: 'database',
        dialect: 'postgres',
        database: 'databaseORM'
    })

    //tryToAuth = function(sequelize){
        sequelize
        .authenticate()
        .then(() => {
            initPostgres.initDb(sequelize, Sequelize).then(function (tables) {
                console.log('Connection has been established successfully.');
                //clearInterval(stopInterval)
                //getConnection = sequelize
                return sequelize
            })
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return sequelize
        });    
        //return sequelize
    //}
    //var getConnection = null

    //var stopinterval = setInterval(tryToAuth, 1000, sequelize)


    return sequelize
}