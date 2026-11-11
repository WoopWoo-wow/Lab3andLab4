const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const requireAuth = require('../middleware/auth');

// ==========================================
// TASK 1: GET /api/students - .populate() with Field Selection
// ==========================================
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .populate('createdBy', 'name email role -_id'); // Populates user info excluding password & _id

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// TASK 2: GET /api/students/stats/summary - Aggregation Pipeline (4 Stages)
// ==========================================
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Student.aggregate([
      // Stage 1: Match documents in collection
      { 
        $match: { _id: { $exists: true } } 
      },
      // Stage 2: Group by course and calculate average age & total student count
      { 
        $group: { 
          _id: '$course', 
          avgAge: { $avg: '$age' }, 
          totalStudents: { $sum: 1 } 
        } 
      },
      // Stage 3: Sort by total students in descending order
      { 
        $sort: { totalStudents: -1 } 
      },
      // Stage 4: Limit output to top 5 courses
      { 
        $limit: 5 
      }
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /students/:id - Fetch single student
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email -_id');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /students - Create a new student
router.post('/', requireAuth, async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /students/:id - Update a student
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /students/:id - Delete a student
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully', deletedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;