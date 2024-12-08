import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  department: String,
});

module.exports = mongoose.model("User", UserSchema);
