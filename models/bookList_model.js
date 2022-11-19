import {User, Book, BookUser} from './bookList.js'
import bcrypt from 'bcrypt'

async function addUser(username, password) {
    try {
        if (!username || !password) {
            throw new Error('Λείπει όνομα ή συνθηματικό χρήστη.')
        }
        let user = await User.findOne({ where: { name: username } })
        if (user)
            throw new Error(`Ο χρήστης ${username} υπάρχει`)

        const hash = await bcrypt.hash(password, 10)

        user = await User.create({ name: username, password: hash })
        return user
    } catch (error) {
        throw error
    }
}

async function login(username, password) {
    try {

        if (!username || !password) {
            throw new Error('Λείπει όνομα ή συνθηματικό χρήστη.')
        }

        let user = await User.findOne({ where: { name: username } })

        if (!user)
            throw new Error(`Ο χρήστης ${username} δεν υπάρχει`)

        const match = await bcrypt.compare(password, user.password)

        if (match) {
            return user
        } else {
            throw new Error("Λάθος κωδικός χρήστη ... ")
        }

    } catch (error) {
        throw error //new Error('Login σφάλμα')
    }
}

async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")
        const user = await User.findOne({where:{name: username}})

        if (!user)
            throw new Error('Άγνωστος χρήστης')
        const myBooks = await user.getBooks({ raw: true })
        return myBooks
    } catch (error) {
        throw new Error('Κάτι συμβαίνει με τη loadBooks')
    }
}


async function addBook(newBook, username) {
    try {
        if (!username)
            throw new Error('Δεν έχει συνδεθεί κάποιος χρήσητης.')
        const user = await User.findOne({ where: { name: username } })
        if (!user)
            throw new Error('Άγνωστος χρήστης.')
        const [book, created] = await Book.findOrCreate({
            where: {
                title: newBook.title,
                author: newBook.author
            }
        })
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

async function deleteBook(bookTitle, username) {
    try {
        // Υπάρχει ο χρήστης;
        const user = await User.findOne({where : {name: username}})
        // Υπάρχει το βιβλίο;
        const bookToDelete = await Book.findOne({ where: { title: bookTitle } })
        // Εάν υπάρχει το βιβλίο διέγραψέ το από τον Πίνακα UserBook
        // για το συγκεκριμένο χρήστη
        await bookToDelete.removeUser(user)
        // Εάν το βιβλίο δεν ανήκει πλέον σε κανένα χρήστη διέγραψέ το και από τον
        // πίνακα Book
        const numberOfUsers = await bookToDelete.countUsers()
        if (numberOfUsers == 0) {
            await Book.destroy({ where: { title: bookTitle } })
        }
    } catch (error) {
        throw error
    }
}

async function findOrAddUser(username) {
    if ( username == undefined) {
        try {
            const [user, created] = await User.findOrCreate({ where: { name: username } })
            return user
        } catch (error) {
            throw new Error('Δε βρίσκω το χρήστη')
        }
    }
}

const fetchComments = async (title) => {

    const bookComments = await BookUser.findAll({ where: { BookTitle: title } })

    let myComments = []
    bookComments.forEach((item) => {
        if (item.comment != null)
            myComments.push({ user: item.UserName, comment: item.comment})
    })

    if (myComments.length == 0)
        return null
    return myComments
}

export {addUser, login, loadBooks, addBook, deleteBook, fetchComments}
