import express from "express";

import User from "../models/User";

const router = express.Router();
router.post("/add", async (req, res) => {
  try {
    const { name, studentId, department } = req.body;
    const user = new User({
      name,
      studentId,
      department,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getUserById/:id", async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
