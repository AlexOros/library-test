import BookInstance from "../models/book-instance.js";
import asyncHandler from "express-async-handler";

export const book_instance_list = async (req, res, next) => {
  console.log("called");
  try {
    const allBookInstances = await BookInstance.find().populate("book").exec();

    res.render("book-instance-list", {
      title: "Book Instance List",
      bookInstanceList: allBookInstances,
    });
  } catch (error) {
    console.log("🔥  error:", error);
    next(error);
  }
};

export const book_instance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-instance-detail", {
    title: "Book:",
    bookInstance,
  });
});

export const book_instance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
});

export const book_instance_create_post = asyncHandler(
  async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance create POST");
  }
);

export const book_instance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

export const book_instance_delete_post = asyncHandler(
  async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
  }
);

export const book_instance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

export const book_instance_update_post = asyncHandler(
  async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
  }
);
