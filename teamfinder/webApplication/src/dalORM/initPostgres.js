
module.exports = function (sequelize, Sequelize) {
    const Account = sequelize.define('account', {
        accountId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        googleId: {type: Sequelize.TEXT, unique: true, allowNull: true},
        firstName: { type: Sequelize.TEXT, allowNull: false },
        lastName: { type: Sequelize.TEXT, allowNull: false },
        email: { type: Sequelize.TEXT, unique: true, allowNull: false },
        password: { type: Sequelize.TEXT, allowNull: true },
        age: { type: Sequelize.TEXT, allowNull: false },
        city: { type: Sequelize.TEXT, allowNull: false },
        gender: { type: Sequelize.TEXT, allowNull: false }
    })

    const Group = sequelize.define('group', {
        groupId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: Sequelize.TEXT, unique: true, allowNull: false },
        image: Sequelize.TEXT,
        sport: { type: Sequelize.TEXT, allowNull: false },
        nrOfMembers: { type: Sequelize.INTEGER, allowNull: false },
        memberSlots: { type: Sequelize.TEXT, allowNull: false },
        city: { type: Sequelize.TEXT, allowNull: false },
        minAge: Sequelize.TEXT,
        maxAge: Sequelize.TEXT,
        skillLevel: { type: Sequelize.TEXT, allowNull: false },
        allowedGender: Sequelize.TEXT
    })
    Group.belongsTo(
        Account,
        { foreignKey: 'authorId' }
    )


    const Message = sequelize.define('message', {
        messageId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        text: { type: Sequelize.TEXT, allowNull: false },
        authorName: { type: Sequelize.TEXT, allowNull: false }
    })

    Message.belongsTo(
        Group,
        { foreignKey: 'groupId' }
    )
    Message.belongsTo(
        Account,
        { foreignKey: 'accountId' }
    )


    const GroupMember = sequelize.define('groupMember')

    Account.belongsToMany(Group, {
        through: GroupMember,
        foreignKey: {
            name: 'accountId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
    Group.belongsToMany(Account, {
        through: GroupMember,
        foreignKey: {
            name: 'groupId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    })
    /*GroupMember.belongsTo(Account)
    GroupMember.belongsTo(Group)*/

    return sequelize.sync().then(function () {
        var dataExists = false
        return Account.findByPk('1').then(function (account) {
            if (account) {
                dataExists = true

                return dataExists
            }
        }).catch(function (error) {

            console.log("CATCH ERROR: ", error)
            return dataExists
        })
    }).then(function (dataExists) {



        if (!dataExists) {

            console.log("THIS SHOULD ONLY APPEAR ONCEEEEEEEEEEEEEEEEEEEEEEEEEE when data is created")
            Account.bulkCreate([
                {
                    googleId: null,
                    firstName: 'admin',
                    lastName: 'admin',
                    email: 'a@a',
                    password: '$2b$10$d/Rmn96Ktxx0YJ2dQ2X/iOJDzFGv/EU90VwB/f6U4iZ1QmIYqyOFa',
                    age: '28',
                    city: 'Jkpg',
                    gender: 'male'
                },
                {
                    googleId: null,
                    firstName: 'Knugen',
                    lastName: 'Axelsson',
                    email: 'b@b',
                    password: '$2b$10$4CgUwazdNHL0bZBmhaRUGunNf27fMZby7O3I6BioBhfyhk3SgClzO',
                    age: '28',
                    city: 'Jkpg',
                    gender: 'male'
                },
                {
                    googleId: null,
                    firstName: 'Bulten',
                    lastName: 'Axelsson',
                    email: 'w@w',
                    password: '$2b$10$qAxwACTHOEK.zZAli6SBvuyfmy4FcBO6NMUBKqz6/hdGNo3jhb4Qe',
                    age: '5',
                    city: 'Jkpg',
                    gender: 'male'
                }
            ]
            ).then(function () {
                console.log("CREATE GROUPSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
                Group.bulkCreate(
                    [
                        {
                            name: 'fanclub',
                            image: 'Volleyball',
                            sport: 'Volleyball',
                            nrOfMembers: '0',
                            memberSlots: '10',
                            city: 'Jkpg',
                            minAge: '2',
                            maxAge: '100',
                            skillLevel: 'Beginner',
                            allowedGender: 'Any',
                            authorId: '1'
                        },
                        {
                            name: 'champs',
                            image: 'Volleyball',
                            sport: 'Volleyball',
                            nrOfMembers: '0',
                            memberSlots: '10',
                            city: 'Jkpg',
                            minAge: '2',
                            maxAge: '100',
                            skillLevel: 'Master',
                            allowedGender: 'Any',
                            authorId: '2'
                        },
                        {
                            name: 'trash',
                            image: 'Volleyball',
                            sport: 'Volleyball',
                            nrOfMembers: '0',
                            memberSlots: '10',
                            city: 'Jkpg',
                            minAge: '2',
                            maxAge: '100',
                            skillLevel: 'Beginner',
                            allowedGender: 'Any',
                            authorId: '1'
                        }
                    ]
                ).then(function () {
                    Message.bulkCreate(
                        [
                            {
                                text: 'First message wohooo',
                                authorName: 'Knugen',
                                groupId: '1',
                                accountId: '1'
                            },
                            {
                                text: 'woof woof',
                                authorName: 'Bulten',
                                groupId: '1',
                                accountId: '2'
                            },
                            {
                                text: 'wtf gör du här Bulten?',
                                authorName: 'Knugen',
                                groupId: '1',
                                accountId: '1'
                            },
                            {
                                text: 'woofwoof',
                                authorName: 'Bulten',
                                groupId: '2',
                                accountId: '2'
                            }
                        ]
                    ).then(function () {
                        GroupMember.bulkCreate(
                            [
                                {
                                    accountId: '1',
                                    groupId: '1'
                                },
                                {
                                    accountId: '1',
                                    groupId: '3',
                                },
                                {
                                    accountId: '2',
                                    groupId: '2'
                                }
                            ]
                        )
                    })
                })
            })

        }
        return { sequelize, Account, Group, Message, GroupMember }
    })
}

/*Account.create({
firstName: 'admin',
lastName: 'admin',
email: 'a@a',
password: '$2b$10$d/Rmn96Ktxx0YJ2dQ2X/iOJDzFGv/EU90VwB/f6U4iZ1QmIYqyOFa',
age: '28',
city: 'Jkpg',
gender: 'male'
}).then(function () {
})
Account.create({
firstName: 'Knugen',
lastName: 'Axelsson',
email: 'b@b',
password: '$2b$10$4CgUwazdNHL0bZBmhaRUGunNf27fMZby7O3I6BioBhfyhk3SgClzO',
age: '28',
city: 'Jkpg',
gender: 'male'
})

Account.create({
firstName: 'Bulten',
lastName: 'Axelsson',
email: 'w@w',
password: '$2b$10$qAxwACTHOEK.zZAli6SBvuyfmy4FcBO6NMUBKqz6/hdGNo3jhb4Qe',
age: '5',
city: 'Jkpg',
gender: 'male'
})*/
                // GROUPS //


/*Group.create({
    name: 'fanclub',
    image: 'Volleyball',
    sport: 'Volleyball',
    nrOfMembers: '0',
    memberSlots: '10',
    city: 'Jkpg',
    minAge: '2',
    maxAge: '100',
    skillLevel: 'Beginner',
    allowedGender: 'Any'
})

Group.create({
    name: 'champs',
    image: 'Volleyball',
    sport: 'Volleyball',
    nrOfMembers: '0',
    memberSlots: '10',
    city: 'Jkpg',
    minAge: '2',
    maxAge: '100',
    skillLevel: 'Master',
    allowedGender: 'Any'
})

Group.create({
    name: 'trash',
    image: 'Volleyball',
    sport: 'Volleyball',
    nrOfMembers: '0',
    memberSlots: '10',
    city: 'Jkpg',
    minAge: '2',
    maxAge: '100',
    skillLevel: 'Beginner',
    allowedGender: 'Any'
})*/
                // MESSAGES //

/*Message.create({
    text: 'First message wohooo',
    authorName: 'Knugen',
    groupId: '1',
    accountId: '1'
})
console.log("First message is created @@@@@@@@@@@@@@@@@@@@@@")

Message.create({
    text: 'woof woof',
    authorName: 'Bulten',
    groupId: '1',
    accountId: '2'
})

Message.create({
    text: 'wtf gör du här Bulten?',
    authorName: 'Knugen',
    groupId: '1',
    accountId: '1'
})

Message.create({
    text: 'woofwoof',
    authorName: 'Bulten',
    groupId: '2',
    accountId: '2'
})*/

                // GROUP MEMBERS //

/*GroupMember.create({
    accountId: '1',
    groupId: '1'
})

GroupMember.create({
    accountId: '1',
    groupId: '3',
})

GroupMember.create({
    accountId: '2',
    groupId: '2'
})*/

