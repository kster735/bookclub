import express from 'express'
import * as Validator from './validator/validation.js'
import * as UserController from './controllers/userController.js'
import * as BookController from './controllers/bookController.js'
import * as BookUsersController from './controllers/bookUsersController.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/books', UserController.isLoggedIn, BookController.showBookList)

router.post('/books',
    Validator.validateLogin,
    UserController.doLogin,
    BookController.showBookList
)

router.get('/addbookform', UserController.isLoggedIn, (req, res) => {
    res.render('form', { username: req.session.username })
})

router.post(
    '/doaddbook',
    UserController.isLoggedIn,
    Validator.validateNewBook,
    BookController.doAddBook,
    (req, res) => {
        res.redirect('/books')
    }
)

router.post('/deletebook',
    UserController.isLoggedIn,
    BookController.doDeleteBook
)

router.get('/logout', UserController.isLoggedIn, UserController.doLogout)


router.get('/register', (req, res) => {
    res.render('registration') //registration.hbs form in views folder
})

router.post('/doregister',
    Validator.validateRegister,
    UserController.doRegister)

router.get('/about', (req, res) => {
    res.render('about', { username: req.session.username })
})


router.post('/goToCommentPage',BookUsersController.goToCommentPage)

router.post('/doAddComment',
    Validator.validateComment,
    BookUsersController.doAddComment,
    BookUsersController.goToCommentPage)

export { router }