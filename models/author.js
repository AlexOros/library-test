import mongoose from "mongoose";

const Schema = mongoose.Schema;

const authorSchema = new Schema(
  {
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

// Virtual for author's full name
authorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let name = "";
  if (this.first_name && this.last_name) {
    name = `${this.last_name}, ${this.first_name}`;
  }

  return name;
});

// Virtual for author's URL
authorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/authors/${this._id}`;
});

// Export model
export default mongoose.model("Author", authorSchema);
