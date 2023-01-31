const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Book = require('./models/books.model');
const Rental = require('./models/rental.model.js');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vinay123:vinay123@practicepurpose.dsxyj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

// Book rental rate per day
const RENTAL_RATE_FICTION = 3;
const RENTAL_RATE_REGULAR = 1.5;
const RENTAL_RATE_NOVELS = 1.5;



// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Route to rent a book
app.post('/rent', async (req, res) => {

  if (!("customerId" && "bookIds_with_duration" in req.body)) {

    return res.status(400).send({ error: 'Invalid request()' });

  } else {
    const { customerId, bookIds_with_duration } = req.body;
    // Validate input
    if (!customerId || bookIds_with_duration.length == 0) {
      return res.status(400).send({ error: 'Invalid request' });
    }

    // Find the books in the database
    let bookIds = []
    bookIds_with_duration.forEach(book_details => { bookIds.push(book_details['bookId']) })
    const books = await Book.find({ _id: { $in: bookIds } });
    // Check if all books are available



    let not_available_books = []
    let charge = 0
    if (books.length > 0) {
      books.forEach(function (book) {
        if (book.availableCopies < 1) {
          not_available_books.push(String(book._id))
        } else {
          var duration = 0
          bookIds_with_duration.forEach(book_data => {
            if (book_data.bookId == String(book._id)) {
              duration = book_data['duration']
            }
          })
          if (book.type == "fiction"){
            charge = charge + (RENTAL_RATE_FICTION * duration)
          } else if (book.type == "novels"){
            charge = charge + (RENTAL_RATE_NOVELS * duration)
          } else if (book.type == "regular") {
            charge = charge + (RENTAL_RATE_REGULAR * duration)
          }
        }
      })

      // console.log("not_available_books",not_available_books)

      const bookId_with_duration = bookIds_with_duration.filter(books => !not_available_books.includes(books['bookId']));


      const rental = new Rental({
        customerId: customerId,
        bookId_with_duration: bookId_with_duration,
        total_charge: charge,
        not_available_books: not_available_books
      });

      await rental.save();
      books.forEach(async (book) => {
        if (book.availableCopies > 0) {
          book.availableCopies = book.availableCopies - 1
          await book.save();
        }

      })
      res.send({ rental });
    } else {
      res.status(404).json({ message: 'There is no BookId present in the store' });
    }
  }
});

// Route to get rental information for a specific book
app.get('/rentals/:customerId', async (req, res) => {
  // Get the book ID from the request parameters
  const customerId = req.params.customerId;

  // Find the rental information for the book in the MongoDB database
  const rentalInfo = await Rental.find({ customerId }).populate('customerId');

  if (rentalInfo) {
    res.status(200).json(rentalInfo);
  } else {
    res.status(404).json({ message: 'Rental information not found for that book' });
  }
});

app.post('/book', async (req, res) => {
  const title = req.body

  const book_detail = await Book.findOne({title: title}).populate('title')

  if (book_detail) {
    res.status(200).json(book_detail);
  } else {
    res.status(404).json({ message: 'book_detail not found for that book' });
  }

}); 

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'server is running on port 3000' });
})

app.listen(3000, () => {
  console.log('Book rental API listening on port 3000');
});
