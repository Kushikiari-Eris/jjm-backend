const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const AuditPlan = require('../models/AIAuditModel');

const apiKey = process.env.AI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash",
});

const generationConfig = {
temperature: 1,
topP: 0.95,
topK: 40,
maxOutputTokens: 8192,
responseMimeType: "text/plain",
};

const prompt = async (req, res) => {
  try {
    const { auditorName, auditTitle } = req.body;

    if (!auditorName || !auditTitle) {
      return res.status(400).json({ error: "Auditor Name and Audit Title are required." });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Generate an audit plan for the product titled "${auditTitle}". Assign it to "${auditorName}". Respond only with JSON. Include the following fields:
              - AuditName
              - Scope
              - ScheduledDate (future date)
              - Priority
              - Status
              - AuditType
              - NotificationsSent
              - ExpectedCompletionDate (future date)
              - Tasks (task should have titled "${auditTitle}", description, Assign it to "${auditorName}", due date, status, and priority)`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      `Generate an audit plan for the product titled "${auditTitle}". Assign it to "${auditorName}". and also can you make the ExpectedCompletionDate to only 10 days or 15 days ahead. Include task with the necessary details.`
    );

    const responseText = result.response?.text
      ? await result.response.text()
      : String(result.response);

    const jsonMatch = responseText.match(/({.*})/s); 
    if (jsonMatch && jsonMatch[1]) {
      const generatedPlan = JSON.parse(jsonMatch[1]);

      // Transform data to match schema
      const auditPlanData = {
        AuditName: generatedPlan.AuditName || auditTitle,
        AssignedAuditor: generatedPlan.AssignedTo || auditorName,
        Scope: generatedPlan.Scope || Scope ,
        ScheduledDate: new Date(
          Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000 
        ) ,
        Priority: generatedPlan.Priority || Priority,
        Status: generatedPlan.Status || Status,
        AuditType: validateAuditType(generatedPlan.AuditType),
        NotificationsSent: !!generatedPlan.NotificationsSent, 
        ExpectedCompletionDate:  new Date(
          Date.now() + (20 + Math.random() * 10) * 24 * 60 * 60 * 1000 
        ),
        // Adding tasks to the audit plan
        Tasks: (generatedPlan.Tasks || []).map(task => ({
          TaskName: task.TaskName || auditTitle ,
          AssignedAuditor: task.AssignedAuditor || auditorName,
          Description: task.Description || Description ,
          DueDate: new Date(
            Date.now() + (1 + Math.random() * 6) * 24 * 60 * 60 * 1000 
          ),
          Status: task.Status || Status,
          Priority: task.Priority || Priority,
        })),
      };

      // Save to database
      const savedAuditPlan = await AuditPlan.create(auditPlanData);
      res.json({ success: true, auditPlan: savedAuditPlan });
    } else {
      throw new Error("Failed to extract JSON from AI response.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to validate AuditType
const validateAuditType = (auditType) => {
  const validTypes = ['Security', 'Performance', 'Compliance', 'Operational', 'Product Audit'];
  return validTypes.includes(auditType) ? auditType : 'Operational'; // Default to 'Operational'
};

const showAllAuditPlan = async (req, res) => {
  try {
      const adutiPlan = await AuditPlan.find();
      res.status(200).json(adutiPlan);
  } catch (error) {
      console.error('Error fetching Audit:', error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

const progressAudit = async (req, res) =>{
  const { progress } = req.body;
  if (progress < 0 || progress > 100) {
    return res.status(400).json({ message: 'Progress must be between 0 and 100.' });
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { Progress: progress, Status: progress === 100 ? 'Completed' : 'In Progress' },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error });
  }
}

module.exports = {
  prompt,
  showAllAuditPlan,
  progressAudit
};
