import express from "express";
import {
  book_instance_list,
  book_instance_detail,
  book_instance_create_get,
  book_instance_create_post,
  book_instance_delete_get,
  book_instance_delete_post,
  book_instance_update_get,
  book_instance_update_post,
} from "../../controllers/book-instance.js";

const router = express.Router();

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get("/create", book_instance_create_get);

// POST request for creating BookInstance.
router.post("/create", book_instance_create_post);

// GET request to delete BookInstance.
router.get("/:id/delete", book_instance_delete_get);

// POST request to delete BookInstance.
router.post("/:id/delete", book_instance_delete_post);

// GET request to update BookInstance.
router.get("/:id/update", book_instance_update_get);

// POST request to update BookInstance.
router.post("/:id/update", book_instance_update_post);

// GET request for one BookInstance.
router.get("/:id", book_instance_detail);

// GET request for list of all BookInstance.
router.get("/", book_instance_list);

export default router;
