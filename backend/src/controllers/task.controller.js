const Task = require("../models/task.model");
const Subtask = require("../models/subtask.model");
const { runTaskPlanner } = require("../services/agent/taskAgent.service");
const { runTaskOrchestrator } = require("../services/orchestrator.service");
const { validatePlan } = require("../utils/planValidator");
const { createPlanFromType } = require("../utils/planFactory");


// POST /api/tasks
const { parseFiles } = require("../utils/fileParser");


exports.createTask = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const files = req.files || [];

    // ✅ Extract file text
    const extractedText = await parseFiles(files);

    if (!prompt && !extractedText) {
      return res.status(400).json({ message: "Prompt or file required" });
    }

    // ✅ Combine content for AI
    const aiInput = `
USER PROMPT:
${prompt}

FILE CONTENT:
${extractedText}
`;

    // 🔹 Planner only classifies task
    const { task_type, title } = await runTaskPlanner({
      prompt: aiInput
    });

    const plan = createPlanFromType(task_type);

    const task = await Task.create({
      user: req.user._id,
      title,
      task_type,
      userPrompt: prompt,
      input_context: extractedText,
      status: "running"
    });

    const subtasks = plan.map((step, index) => ({
      task_id: task._id,
      agent_type: step.agent,
      description: step.description,
      order_index: index,
      status: "pending"
    }));

    await Subtask.insertMany(subtasks);
    await runTaskOrchestrator(task._id);

    res.status(202).json({
      task: {
        id: task._id,
        title,
        task_type,
        status: task.status
      }
    });

  } catch (error) {
    console.error("TASK CREATE ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};


// GET /api/tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtasks = await Subtask.find({ task_id: task._id }).sort({
      order_index: 1
    });

    res.json({ task, subtasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

