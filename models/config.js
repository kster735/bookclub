import { Sequelize } from "sequelize"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // },
    logging: false,
    define: {
        timestamps: false
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Επιτυχής σύνδεση.')
    })
    .catch(err => {
        console.error('Δεν έγινε σύνδεση στη βδ: ', err)
    })

export { sequelize }