import { Router } from "express";
import authorRouter from "./author.js";
import bookRouter from "./book.js";
import bookInstanceRouter from "./book-instance.js";
import genreRouter from "./genre.js";
import { index } from "../../controllers/book.js";

const router = Router();

router.use("/authors", authorRouter);
router.use("/books", bookRouter);
router.use("/book-instances", bookInstanceRouter);
router.use("/genres", genreRouter);
// GET catalog home page.
router.use("/", index);

export default router;
