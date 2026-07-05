import express from 'express';
import { 
  listTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../controllers/testimonialController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listTestimonials);
router.post('/', verifyAdmin, createTestimonial);
router.put('/:id', verifyAdmin, updateTestimonial);
router.delete('/:id', verifyAdmin, deleteTestimonial);

export default router;
