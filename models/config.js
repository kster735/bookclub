import { Sequelize } from "sequelize"

const sequelize = new Sequelize("postgres://iflexic1_root:o$q9sixT};6l@localhost:5432/iflexic1_bookclub_db", {
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