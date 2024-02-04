import express from "express";
import path from "path";
import indexRouter from "./src/routes/index.js";
import wikiRouter from "./src/routes/wiki/index.js";
// import authorRouter from "./routes/author.js";
// import bookRouter from "./routes/book.js";
// import bookInstanceRouter from "./routes/book-instance.js";
import { setupDB, setupApp, setupErrors } from "./setup.js";

main();

async function main() {
  const app = express();
  setupApp(app);

  app.use("/", indexRouter);
  app.use("/wiki", wikiRouter);
  // app.use("/authors", authorRouter);
  // app.use("/books", bookRouter);
  // app.use("/book-instances", bookInstanceRouter);

  setupErrors(app);

  try {
    await setupDB();
    app.listen(3000, () => "Listening on port 3000");
  } catch (error) {
    console.log(error);
  }
}
