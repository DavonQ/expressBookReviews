const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Find the user based on the provided username
    const user = users.find(user => user.username === username);
  
    // Check if the user exists and the password matches
    if (user && user.password === password) {
      
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  });
  

// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username || "Anonymous"; // Use session username or default to "Anonymous"
  
    // Check if the book with the given ISBN exists
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
  
      // Check if the user has already reviewed the book
      if (book.reviews.hasOwnProperty(username)) {
        // User has already reviewed the book, modify the existing review
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
      } else {
        // User has not reviewed the book, add a new review
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

  
  
  // Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    // Check if the user has posted a review for the given ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review deleted" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
