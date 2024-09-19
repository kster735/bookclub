import 'dotenv/config'
import express from 'express'
import {create} from 'express-handlebars'
import {router} from './routes.js'
import session from 'express-session'
import createMemoryStore from 'memorystore'

const MemoryStore = createMemoryStore(session)

const myBooksSession = session({
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore({checkPeriod: 86400*1000}),
    resave: false,
    saveUninitialized: false,
    name: 'vivliolesxi', // connect.sid
    cookie:{
        maxAge: 1000*60*20 // 20 minutes
    }
})

const app = express()

const hbs = create({
    extname: '.hbs',
    helpers: {
        inc: function (x) { return x + 1 },
        dec: function (x) { return x - 1 }
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(myBooksSession)
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))



app.use('/', router)

app.use((req, res) =>{
    res.redirect('/');
})


app.use((err, req, res, next) => {
    console.log("error occured: " + err.message)
    next(err)
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.render('home', {message: err.message})
})

const PORT = process.env.PORT || '' // we won't a port in production for cpanel

app.listen(PORT, () => {
    console.log(`Η εφαρμογή ξεκίνησε στη θύρα -> ${PORT}`)
})