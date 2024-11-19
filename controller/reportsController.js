const Reports = require('../models/reportsModel');

// Create a new report
const createReport = async (req, res) => {
  try {
    const { AssignedAuditor, AuditName, Reports: reportContent, image } = req.body;

    const newReport = new Reports({
      AssignedAuditor,
      AuditName,
      Reports: reportContent,
      image,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await Reports.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

// Get a specific report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Reports.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
};

// Update a report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedReport = await Reports.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Reports.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
