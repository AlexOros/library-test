import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const bookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    imprint: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["available", "maintenance", "loaned", "reserved"],
      default: "maintenance",
    },
    due_back: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

bookInstanceSchema.virtual("url").get(function () {
  return `/catalog/book-instances/${this._id}`;
});

bookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

export default mongoose.model("BookInstance", bookInstanceSchema);
