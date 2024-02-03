import mongoose from "mongoose";

const mongoDB =
  "mongodb+srv://admin:axelrico18@cluster-test-1.mzkgcsu.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);

export default async function connectToDb() {
  try {
    await mongoose.connect(mongoDB, {
      dbName: "library",
    });
  } catch (error) {
    console.log(error);
  }
}
