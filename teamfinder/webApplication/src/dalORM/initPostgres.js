module.exports = function () {

    return {

        initAccount: function (sequelize, Sequelize) {
            const Account = sequelize.define('account', {
                accountId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
                firstName: { type: Sequelize.TEXT, allowNull: false },
                lastName: { type: Sequelize.TEXT, allowNull: false },
                email: { type: Sequelize.TEXT, unique: true, allowNull: false },
                password: { type: Sequelize.TEXT, allowNull: false },
                age: { type: Sequelize.age, allowNull: false },
                city: { type: Sequelize.TEXT, allowNull: false },
                gender: { type: Sequelize.TEXT, allowNull: false }
            })

            Account.create({
                firstName: 'admin',
                lastName: 'admin',
                email: 'a@a',
                password: '$2b$10$d/Rmn96Ktxx0YJ2dQ2X/iOJDzFGv/EU90VwB/f6U4iZ1QmIYqyOFa',
                age: '28',
                city: 'Jkpg',
                gender: 'male'
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
            })
            return Account
        },

        initGroup: function (sequelize, Sequelize) {
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
            Group.belongsTo(Account)


            Group.create({
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
            })
            return Group
        },

        initMessage: function (sequelize, Sequelize) {
            const Message = sequelize.define('message', {
                messageId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
                text: { type: Sequelize.TEXT, allowNull: false },
                authorName: { type: Sequelize.TEXT, allowNull: false }
            })

            Message.belongsToMany(Group, Account)
            Message

            Message.create({
                text: 'First message wohooo',
                authorName: 'Knugen',
                groupId: '1',
                accountId: '1'
            })

            Message.create({
                text: 'woof woof',
                authorName: 'Bulten',
                groupId: '1',
                accountId: '1'
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
                groupId: '1',
                accountId: '1'
            })

            return Message
        },

        initGroupMember: function (sequelize, Sequelize) {
            const GroupMember = sequelize.define()
            GroupMember.belongsToMany(Account, Group)

            GroupMember.create({
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
            })
            return GroupMember
        }

    }

}