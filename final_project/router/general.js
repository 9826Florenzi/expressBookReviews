const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the list of all books available in the shop using Promise callbacks / Async-Await
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ status: 500, message: "Error retrieving books" });
        }
    });

    getBooks
        .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks / Async-Await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// Task 3 & Task 12: Get book details based on author using Promise callbacks / Async-Await
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found by author '${author}'` });
        }
    });

    getBooksByAuthor
        .then((booksFound) => res.status(200).send(JSON.stringify(booksFound, null, 4)))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// Task 4 & Task 13: Get all books based on title using Promise callbacks / Async-Await
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found with title '${title}'` });
        }
    });

    getBooksByTitle
        .then((booksFound) => res.status(200).send(JSON.stringify(booksFound, null, 4)))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

module.exports.general = public_users;
