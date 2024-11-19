const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
