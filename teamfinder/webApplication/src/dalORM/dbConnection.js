
const Sequelize = require('sequelize')



module.exports = function ({initPostgres}) {

    
    const sequelize = new Sequelize('databaseORM', 'user', 'root', {
        host: 'database',
        dialect: 'postgres'
    })
    
    return sequelize
   //const sequelize = new Sequelize('postgres:databaseORM')

    return sequelize
        .authenticate()
        .then(() => {
            
            const Account = initPostgres.initAccount(sequelize, Sequelize)
            const Group = initPostgres.initGroup(sequelize, Sequelize)
            const Message = initPostgres.initMessage(sequelize, Sequelize)
            const GroupMember = initPostgres.initGroupMember(sequelize, Sequelize)

            console.log('Connection has been established successfully.');

            return {sequelize, Account, Message, Group, GroupMember}

        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return sequelize

        });


    
    

}