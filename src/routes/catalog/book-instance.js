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

router.get("/create", book_instance_create_get);

router.post("/create", book_instance_create_post);

router.get("/:id/delete", book_instance_delete_get);

router.post("/:id/delete", book_instance_delete_post);

router.get("/:id/update", book_instance_update_get);

router.post("/:id/update", book_instance_update_post);

router.get("/:id", book_instance_detail);

router.get("/", book_instance_list);

export default router;
