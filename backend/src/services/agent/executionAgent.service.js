const Subtask = require("../../models/subtask.model");
const Task = require("../../models/task.model");

exports.runExecutionAgent = async ({ task }) => {
  // 🔹 Fetch execution subtask explicitly
  const executionSubtask = await Subtask.findOne({
    task_id: task._id,
    agent_type: "execution"
  });

  if (!executionSubtask) {
    throw new Error("Execution subtask not found");
  }

  // 🔹 Fetch content output
  const contentSubtask = await Subtask.findOne({
    task_id: task._id,
    agent_type: "content",
    status: "completed"
  });

  if (!contentSubtask || !contentSubtask.output) {
  throw new Error("Execution failed: Content output missing");
}


  // ✅ Final output comes ONLY from ContentAgent
  task.result_summary = contentSubtask.output;
  task.status = "completed";
  await task.save();

  executionSubtask.status = "completed";
  executionSubtask.output = { finalized: true };
  await executionSubtask.save();

  return task.result_summary;
};
