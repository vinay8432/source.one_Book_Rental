const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
    bookId_with_duration: { 
        type: Array
    },
    customerId: {
        type: String,
        required: true
    },
    total_charge: {
        type: Number,
        required: true
    },
    not_available_books: {
        type: Array
    }
}, { timeStamps: true })

const Rental = mongoose.model('Rental', RentalSchema);
//export model to use in other files
module.exports = Rental;
