const mongoose = require('mongoose');

// Define the schema for AI Maintenance
const aiMaintenanceSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('AIMaintenance', aiMaintenanceSchema);
