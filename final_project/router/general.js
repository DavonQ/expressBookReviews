const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Create a new user
    const newUser = { username, password };
    users.push(newUser);
  
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://your-api-url/books');
        const bookList = response.data;
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://your-api-url/books/isbn/${isbn}`);
        const book = response.data;
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://your-api-url/books/author/${author}`);
        const booksByAuthor = response.data;
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: "No books found by the author" });
    }
});


// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://your-api-url/books/title/${title}`);
        const booksWithTitle = response.data;
        return res.status(200).json(booksWithTitle);
    } catch (error) {
        return res.status(404).json({ message: "No books found with the title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      const reviews = book.reviews;
      return res.status(200).json(reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
