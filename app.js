import express from "express";
import indexRouter from "./src/routes/index.js";
import catalogRouter from "./src/routes/catalog/index.js";
import { setupDB, setupApp, setupErrors } from "./setup.js";

main();

async function main() {
  const app = express();
  setupApp(app);

  app.use("/", indexRouter);
  // app.use('/users', usersRouter);
  app.use("/catalog", catalogRouter);

  setupErrors(app);

  try {
    await setupDB();
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });

    // console.log(app._router.stack);
  } catch (error) {
    console.log(error);
  }
}
