import { User } from '../models/bookList.js'
import * as BookList from '../models/bookList_model.js'
import { sequelize } from '../models/config.js'

const goToCommentPage = async (req, res, next) => {
    try {
        const currentBook = { title: req.body.title, author: req.body.author }

        const bookComments = await BookList.fetchComments(currentBook.title)

        res.render('comments', {
            username: req.session.username,
            book: currentBook,
            comments: bookComments
        })
    } catch (error) {
        next(error)
    }
}

const doAddComment = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { name: req.session.username } })
        await sequelize.query(`UPDATE "BookUsers" SET "comment"='${req.body.comment}' WHERE "UserName"='${user.name}' AND "BookTitle"='${req.body.title}'`)
        next()
    } catch (error) {
        next(error)
    }
}

export { goToCommentPage, doAddComment }