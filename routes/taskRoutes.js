const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');


router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.put('/tasks/:id', taskController.editTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
