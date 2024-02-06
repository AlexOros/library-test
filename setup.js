import createError from "http-errors";
import { json, urlencoded, static as expressStatic } from "express";
import path, { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function setupApp(app) {
  // view engine setup
  app.set("views", path.join(__dirname, "src/views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(expressStatic(join(__dirname, "public")));
}

export function setupErrors(app) {
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
}

const { DB_USER_NAME, DB_USER_PASSWORD, DB_CLUSTER } = process.env;
const mongoDB = `mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@${DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

export async function setupDB() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoDB, {
    dbName: "library",
  });
}
