// backend/routes/resumeRoutes.js
import express from 'express';
import Resume from '../models/Resume.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Save resume endpoint
router.post('/save', 
  [
    // Add validation/sanitization
    body('personal.email').isEmail().normalizeEmail(),
    body('personal.phone').trim().escape(),
    body('personal.linkedin').isURL().optional(),
    body('personal.github').isURL().optional(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const resumeData = req.body;
      
      // Add user association if using authentication
      if (req.user) {
        resumeData.userId = req.user.id;
      }

      // Save to database
      const savedResume = await Resume.create(resumeData);
      
      res.status(201).json({
        message: 'Resume saved successfully',
        id: savedResume._id
      });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;