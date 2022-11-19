import { sequelize } from './config.js'
import { DataTypes } from 'sequelize'
// Ορισμός Μοντέλου
const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    },
})

const User = sequelize.define('User', {
    name: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    password: {
        type: DataTypes.TEXT,
    },
})

const BookUser = sequelize.define('BookUser', {
    comment: {
        type: DataTypes.TEXT
    }
})

Book.belongsToMany(User, { through: BookUser })
User.belongsToMany(Book, { through: BookUser })

await sequelize.sync({ alert: true })

export {User, Book, BookUser}