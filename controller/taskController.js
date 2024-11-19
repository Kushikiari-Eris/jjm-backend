const Task = require('../models/taskModels');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { taskName } = req.body;

    if (!taskName) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    const newTask = await Task.create({ taskName });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a task by ID
const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName } = req.body;

    if (!taskName) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getAllTasks, editTask, deleteTask };
