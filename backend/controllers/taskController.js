// controllers/taskController.js
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new Task({ userId: req.userId, task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
};

export const updateTaskCompletion = async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { task } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { task },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
};