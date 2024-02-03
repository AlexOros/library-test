import createError from "http-errors";
import express, { json, urlencoded, static as expressStatic } from "express";
import path, { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const mongoDB =
  "mongodb+srv://admin:axelrico18@cluster-test-1.mzkgcsu.mongodb.net/?retryWrites=true&w=majority";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main();

async function main() {
  const app = express();
  // view engine setup
  app.set("views", join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(expressStatic(join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/users", usersRouter);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    console.log("called");
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(mongoDB, {
      dbName: "library",
    });
    app.listen(3000, () => "Listening on port 3000");
  } catch (error) {
    console.log(error);
  }
}
