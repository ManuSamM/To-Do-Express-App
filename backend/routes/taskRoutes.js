// routes/taskRoutes.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  deleteTask,
  updateTaskCompletion,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.delete('/:id', authenticate, deleteTask);
router.patch('/:id', authenticate, updateTaskCompletion);
router.patch('/:id/edit', authenticate, updateTask);

export default router;
