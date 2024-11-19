const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
  AssignedAuditor: {
    type: String,
    required: true,
  },
  AuditName:{
    type: String,
    required: true,
  },
  Reports: { 
    type: String, 
    required: true 
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Reports = mongoose.model('Reports', reportsSchema)

module.exports = Reports
