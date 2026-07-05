import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
