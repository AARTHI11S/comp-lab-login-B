import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  department: String,
  inTime: { type: Date, default: Date.now },
  outTime: String,
});

module.exports = mongoose.model("Student", studentSchema);
