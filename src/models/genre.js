import mongoose from "mongoose";

const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

genreSchema.virtual("url").get(function () {
  return `/catalog/genres/${this._id}`;
});

export default mongoose.model("Genre", genreSchema);
