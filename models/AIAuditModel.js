const mongoose = require('mongoose');

// Define the Task schema for each task under an audit plan
const taskSchema = new mongoose.Schema({
  TaskName: {
    type: String,
    required: true,
  },
  AssignedAuditor: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  DueDate: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Not Started',
  },
  Priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  Progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

// Define the AuditPlan schema
const auditPlanSchema = new mongoose.Schema({
  AuditName: {
    type: String,
    required: true,
  },
  AssignedAuditor: {
    type: String,
    required: true,
  },
  Scope: {
    type: String,
    required: true,
  },
  ScheduledDate: {
    type: Date,
    required: true,
  },
  Priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  Status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Planned'],
    default: 'Scheduled',
  },
  AuditType: {
    type: String,
    enum: ['Security', 'Performance', 'Compliance', 'Operational', 'Product Audit'],
    required: true,
  },
  NotificationsSent: {
    type: Boolean,
    required: true,
  },
  ExpectedCompletionDate: {
    type: Date,
    required: true,
  },
  // Tasks related to the audit plan
  Tasks: [taskSchema], // Array of task sub-documents
});

// Create the AuditPlan model
const AuditPlan = mongoose.model('AuditPlan', auditPlanSchema);

module.exports = AuditPlan;
