const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Gọi Model Student từ thư mục models

// GET /api/students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/students
router.post('/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/students/:id
router.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/students/:id
router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa sinh viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;