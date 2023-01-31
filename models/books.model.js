const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    },
}, { timeStamps: true })

const Book = mongoose.model('Book', BookSchema);
//export model to use in other files
module.exports = Book;
