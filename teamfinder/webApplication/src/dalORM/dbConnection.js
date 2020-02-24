
const Sequelize = require('sequelize')



module.exports = function () {

    
    const sequelize = new Sequelize('databaseORM', 'postgres', 'password', {
        host: 'database',
        dialect: 'postgres'
    })
    
    
   //const sequelize = new Sequelize('postgres:databaseORM')

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