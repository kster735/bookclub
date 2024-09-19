import * as BookList from '../models/bookList_model.js'

const doRegister = async (req, res, next) => {
    const username = req.body.newUsername
    const password = req.body.newPassword
    try {
        const user= await BookList.addUser(username, password)

        if (user) {
            res.render('home', { newmessage: `Έγινε εγγραφή του χρήστη ${username} με επιτυχία.` })
        } else {
            throw new Error('Άγνωστο σφάλμα κατά την εγγραφή του χρήστη.')
        }
    } catch (error) {
        next(error)
    }
}

const doLogin = async (req, res, next) => {
    // Έλεγχος εγκυρότητας του χρήστη
    try {
        const user = await BookList.login(req.body.username, req.body.password)
        if (user) {
            req.session.username = req.body.username
            res.locals.username = req.session.username
            next()
        } else {
            throw new Error("Άγνωστο σφάλμα κατά την είσοδο χρήστη")
        }
    } catch (error) {
        next(error)
    }
}

async function isLoggedIn(req, res, next) {
    if (req.session.username) {
        res.locals.username = req.session.username
        next()
    } else {
        res.redirect('/bookclub')
    }
}

const doLogout = (req, res) => {
    req.session.destroy()
    res.redirect('/bookclub')
}

export { isLoggedIn, doLogin, doRegister, doLogout }