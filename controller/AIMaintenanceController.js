const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIMaintenance = require('../models/AIMaintenanceModels');
const Task = require('../models/taskModels');

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

const autoScheduling = async (req, res) => {
    try {
      const { tasks } = req.body;
  
      if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ error: "Tasks array is required and cannot be empty." });
      }
  
      const usedDates = new Set(); // Track unique dates
      const results = [];
      const today = new Date(); // Current date
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // Month index (0-based)
  
      // Function to generate a random date within the month
      const generateRandomDate = () => {
        const startDay = Math.max(today.getDate(), 1); // Start from today or the 1st of the month
        const endDay = new Date(currentYear, currentMonth + 1, 0).getDate(); // Last day of the month
        const randomDay = Math.floor(Math.random() * (endDay - startDay + 1)) + startDay;
        return new Date(currentYear, currentMonth, randomDay).toISOString().split("T")[0];
      };
  
      for (const task of tasks) {
        const { taskName } = task;
        if (!taskName) {
          throw new Error("Task name is missing in one of the tasks.");
        }
  
        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate a unique schedule for the task "${taskName}" within the month. Respond in JSON format. Ensure the scheduledDate is unique.`,
                },
              ],
            },
          ],
        });
  
        const result = await chatSession.sendMessage(
          `Generate a unique schedule for the task "${taskName}". and also dont repeat the date when new is added. Respond in JSON format.`
        );
  
        const responseText = result.response?.text
          ? await result.response.text()
          : String(result.response);
  
        const jsonMatch = responseText.match(/({.*})/s);
        let scheduledDate;
  
        if (jsonMatch && jsonMatch[1]) {
          const generatedPlan = JSON.parse(jsonMatch[1]);
          scheduledDate = generatedPlan.scheduledDate || generateRandomDate();
        } else {
          scheduledDate = generateRandomDate();
        }
  
        // Ensure the date is unique
        while (usedDates.has(scheduledDate)) {
          scheduledDate = generateRandomDate(); // Regenerate if already used
        }
  
        usedDates.add(scheduledDate);
  
        const autoMaintenance = {
          taskName,
          scheduledDate,
        };
  
        const savedAutoMaintenance = await AIMaintenance.create(autoMaintenance);
        results.push(savedAutoMaintenance);
  
        // Delete the task from the Task collection
        await Task.deleteOne({ taskName });
      }
  
      res.json({ success: true, auditPlans: results });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

const showAllAutoScheduling = async (req, res) => {
  try {
    const tasks = await AIMaintenance.find().sort({ scheduledDate: 1 }); // Sort by scheduled date
    res.status(200).json(tasks); // Return the tasks to the frontend
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

module.exports = {
  autoScheduling,
  showAllAutoScheduling,
};
