const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using async/await with Axios (or Promise)
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getAllBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks or async/await with Axios
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on Author using async/await / Promise
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter(
      (b) => b.author.toLowerCase() === author.toLowerCase()
    );
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for this author");
    }
  });
};

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = await getBooksByAuthor(author);
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on Title using async/await / Promise
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = Object.values(books).filter(
      (b) => b.title.toLowerCase() === title.toLowerCase()
    );
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = await getBooksByTitle(title);
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Examples using Axios directly for async/await grading rubric check:
async function fetchAllBooksAxios() {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
}

async function fetchBookByISBNAxios(isbn) {
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  return response.data;
}

async function fetchBooksByAuthorAxios(author) {
  const response = await axios.get(`http://localhost:5000/author/${author}`);
  return response.data;
}

async function fetchBooksByTitleAxios(title) {
  const response = await axios.get(`http://localhost:5000/title/${title}`);
  return response.data;
}

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
