import * as BookList from '../models/bookList_model.js'

const doAddBook = async (req, res, next) => {
    try {
        const newBook = {
            "title": req.body["newTitle"],
            "author": req.body["newAuthor"]
        }
        await BookList.addBook(newBook, req.session.username)
        next() // next is books.handlebars
    } catch (error) {
        next(error) // redirects to error page
    }
}

const doDeleteBook = async (req, res) => {
    await BookList.deleteBook(req.body["title"], req.session.username)
    res.redirect('/books')
}

async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render(
            'books',
            {
                books: myBooks,
                size: myBooks.length,
                username: req.session.username
            })
    } catch (error) {
        //next(error)
        throw new Error('Αδυναμία ανάκτησης βιβλίων από τη βάση δεδομένων')
    }
}

export { showBookList, doAddBook, doDeleteBook }