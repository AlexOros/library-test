import { Book, Author, Genre, BookInstance } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { Mongoose } from "mongoose";

export const index = async (req, res, next) => {
  try {
    const [
      bookCount,
      bookInstanceCount,
      availableBookInstanceCount,
      authorCount,
      genreCount,
    ] = await Promise.all([
      Book.countDocuments({}),
      BookInstance.countDocuments({}),
      BookInstance.countDocuments({ status: "available" }),
      Author.countDocuments({}),
      Genre.countDocuments({}),
    ]);

    res.render("index", {
      title: "Local Library Home",
      bookCount,
      bookInstanceCount,
      availableBookInstanceCount,
      authorCount,
      genreCount,
    });
  } catch (error) {
    next(error);
  }
};

export const book_list = asyncHandler(async (req, res, next) => {
  try {
    const allBooks = await Book.find({}, "title author")
      .sort({ title: 1 })
      .populate("author");

    console.log(allBooks);

    res.render("book-list", { title: "Book List", bookList: allBooks });
  } catch (error) {
    next(error);
  }
});

export const book_detail = asyncHandler(async (req, res, next) => {
  const { id: bookId } = req.params;
  if (!Mongoose.prototype.isValidObjectId(bookId)) {
    const err = new Error("Invalid book id");
    err.status = 400;
    return next(err);
  }

  // Get details of books, book instances for specific book
  const [book, bookInstances] = await Promise.all([
    Book.findById(bookId).populate("author").populate("genre"),
    BookInstance.find({ book: bookId }),
  ]);

  if (book === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-detail", {
    title: book.title,
    book: book,
    bookInstances,
  });
});

export const book_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

export const book_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

export const book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

export const book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

export const book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

export const book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
