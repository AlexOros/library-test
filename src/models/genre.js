import mongoose from "mongoose";

const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

genreSchema.virtual("url").get(function () {
  return `/catalog/genres/${this._id}`;
});

export default mongoose.model("Genre", genreSchema);
