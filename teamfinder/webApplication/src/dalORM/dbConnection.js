
const Sequelize = require('sequelize')



module.exports = function () {

    
    const sequelize = new Sequelize('databaseORM', 'username', 'password', {
        host: 'databaseORM',
        dialect: 'postgres'
    })
    
    
   //const sequelize = new Sequelize('postgres:databaseORM.js')

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    return sequelize

}