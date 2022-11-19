import { body, validationResult } from 'express-validator'
import validator from 'validator'
import { fetchComments } from '../models/bookList_model.js'

const validateLogin = [
    body("username")
        .trim().escape().isLength({ min: 4 })
        .withMessage("Το όνομά σας θα πρέπει να έχει τουλάχιστο 4 γράμματα"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            // Αν αποτύχει ο έλεγχος εγκυρότητας του χρήστη
            res.render('home', { message: errors.mapped() })
        }
    }
]

const validateNewBook = [
    body("newTitle") //έλεγχος εγκυρότητας για τον τίτλο
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    !validator.isNumeric(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 2 })
        .withMessage("Τουλάχιστον 2 γράμματα"),
    body("newAuthor") //έλεγχος εγκυρότητας για τον συγγραφέα
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 2 })
        .withMessage("Τουλάχιστον 2 γράμματα"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            res.render('form', {
                "message": errors.mapped(),
                "title": req.body["newTitle"],
                "author": req.body["newAuthor"]
            })
        }
    }
]

const validateRegister = [
    body("newUsername")
        .trim().escape().isLength({ min: 4 }) // Θα μπορούσαμε να έχουμε και άλλους ελέγχους
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    body("newPasswordRepeat")
        .custom((value, context) => {
            if (value != context.req.body.newPassword)
                throw new Error("Το συνθηματικό πρέπει να είναι το ίδιο και στα δύο πεδία")
            else
                return true
        })
        .trim()
        .escape()
        .isLength({ min: 4, max: 10 })
        .withMessage('Το συνθηματικό πρέπει να έχει από 4 μέχρι 10 χαρακτήρες'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("registration", {
                message: errors.mapped()
            })
        }
    }
]

const validateComment = [
    body("comment") //έλεγχος εγκυρότητας για τον τίτλο
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    !validator.isNumeric(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true
        })
        .trim()
        .isLength({ min: 1 })
        .withMessage("Απαιτείται τουλάχιστον 1 γράμμα"),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            const currentBook = { title: req.body.title, author: req.body.author }
            const bookComments = await fetchComments(currentBook.title)
            res.render('comments', {
                message: errors.mapped(),
                username: req.session.username,
                book: currentBook,
                comments: bookComments,
            })
        }
    }
]

export { validateLogin, validateNewBook, validateRegister, validateComment }