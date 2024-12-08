import express from "express";

import Student from "../models/Student";
import User from "../models/User";

// Add a student entry (Create)

const router = express.Router();
router.post("/add", async (req, res) => {
  try {
    const { name, studentId, department, outTime } = req.body;
    const student = new Student({
      name,
      studentId,
      department,
      outTime,
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Checkin to Lab
router.post("/checkin", async (req, res) => {
  const { studentId } = req.body;
  try {
    const student = await User.findOne({ studentId });
    if (!student)
      return res
        .status(200)
        .json({ success: false, message: "Invaid Student ID" });
    else {
      const check = await Student.findOne({ studentId, outTime: null });
      if (check)
        return res.status(200).json({
          success: false,
          message: `Please Checkout the previous visit for ${student.name} before the new visit`,
        });
      else {
        const record = new Student({
          name: student.name,
          department: student.department,
          inTime: new Date(),
          outTime: null,
          studentId,
        });
        await record.save();
        res.status(201).json({
          success: true,
          message: `Student ${student.name} Checked In Successfully`,
          data: record,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Student Checkout from Lab
router.post("/checkout", async (req, res) => {
  const { studentId } = req.body;
  try {
    const student = await User.findOne({ studentId });
    if (!student)
      return res
        .status(200)
        .json({ success: false, message: "Invaid Student ID" });
    else {
      const record = await Student.findOne({ studentId, outTime: null });
      if (!record)
        return res.status(200).json({
          success: false,
          message: "No Entry time found for this student",
        });
      else {
        record.outTime = new Date();
        await record.save();
        return res.status(201).json({
          success: true,
          message: `Student ${student.name} Checked Out Successfully`,
          data: record,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Summary Data
router.get("/attendance-summary", async (req, res) => {
  const { month, year } = req.query; // Expect month and year as query parameters

  // Validate month and year parameters
  if (!month || !year) {
    return res.status(200).json({ message: "Month and year are required" });
  }

  try {
    // Convert month and year to integers
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    const attendanceSummary = await Student.aggregate([
      {
        $match: {
          inTime: {
            $gte: new Date(yearInt, monthInt - 1, 1), // Start of the month
            $lt: new Date(yearInt, monthInt, 1), // Start of the next month
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$inTime" } }, // Group by day
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(attendanceSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students for the day (Read)
router.get("/today", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0); // start of the day
    const end = new Date();
    end.setHours(23, 59, 59, 999); // end of the day

    const students = await Student.find({
      inTime: { $gte: start, $lte: end },
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a student entry (Update)
router.put("/update/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a student entry (Delete)
router.delete("/delete/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
