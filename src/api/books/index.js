// ******************************************** BOOKS RELATED ENDPOINTS *****************************

// *********************************************** BOOKS CRUD ***************************************

/*

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query parameters)
3. READ (single user) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single user) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/books/:bookId

*/

import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import fs from "fs"

const booksRouter = express.Router()

const booksJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "books.json"
)

const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
const writeBooks = booksArray =>
  fs.writeFileSync(booksJSONPath, JSON.stringify(booksArray))

booksRouter.post("/", (req, res) => {
  const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }

  const books = getBooks()

  books.push(newBook)

  writeBooks(books)

  res.status(201).send({ id: newBook.id })
})

booksRouter.get("/", (req, res) => {
  const books = getBooks()

  if (req.query && req.query.category) {
    const filteredBooks = books.filter(
      book => book.category === req.query.category
    )
    res.send(filteredBooks)
  } else {
    res.send(books)
  }
})

booksRouter.get("/:bookId", (req, res) => {
  const books = getBooks()
  const foundBook = books.find(book => book.id === req.params.bookId)
  res.send(foundBook)
})

booksRouter.put("/:bookId", (req, res) => {
  const books = getBooks()

  const index = books.findIndex(book => book.id === req.params.bookId)

  const oldBook = books[index]

  const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }
  books[index] = updatedBook

  writeBooks(books)

  res.send(updatedBook)
})

booksRouter.delete("/:bookId", (req, res) => {
  const books = getBooks()

  const remaingBooks = books.filter(book => book.id !== req.params.bookId)

  writeBooks(remaingBooks)

  res.status(204).send()
})

export default booksRouter