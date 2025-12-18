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

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const { task_type, title } = await runTaskPlanner({ prompt });

    const plan = createPlanFromType(task_type);

    const task = await Task.create({
      user: req.user._id,
      title,
      task_type,
      userPrompt: prompt,
      hasFiles: files.length > 0,
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
    id: task._id.toString(),
    _id: task._id.toString(),
    title,
    task_type,
    status: task.status
  }
});


  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
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

exports.streamTask = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const taskId = req.params.id;

  const interval = setInterval(async () => {
    const task = await Task.findById(taskId);

    if (!task) return;

    if (task.result_chunks?.length) {
      const lastChunk = task.result_chunks.slice(-1)[0];
      res.write(`data: ${JSON.stringify(lastChunk)}\n\n`);
    }

    if (task.status === "completed") {
      res.write(`data: [DONE]\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 800);
};


