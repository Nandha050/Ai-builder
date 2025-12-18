// const Task = require("../models/task.model");
// const Subtask = require("../models/subtask.model");
// const AgentRun = require("../models/agentRun.model");

// // Agents
// const { runKnowledgeAgent } = require("./agent/knowledgeAgent.service");

// const { runDataAgent } = require("./agent/dataAgent.service");
// const { runContentAgent } = require("./agent/contentAgent.service");
// const { runExecutionAgent } = require("./agent/executionAgent.service");

// exports.runTaskOrchestrator = async (taskId) => {
//     console.log("🚀 Orchestrator started for task:", taskId);
//   try {
//     // Fetch task
//     const VALID_FLOWS = {
//   email: ["content", "execution"],
//   plan: ["knowledge", "content", "execution"],
//   analysis: ["data", "knowledge", "content", "execution"],
//   code: ["content", "execution"],
//   general: ["content", "execution"]
// };

// const validatePlan = (taskType, plan) => {
//   const expected = VALID_FLOWS[taskType];
//   const actual = plan.map(p => p.agent);

//   if (!expected || expected.join() !== actual.join()) {
//     throw new Error(
//       `Invalid agent flow for ${taskType}. Expected ${expected}, got ${actual}`
//     );
//   }
// };

//     const task = await Task.findById(taskId);
//     if (!task) throw new Error("Task not found");

//     task.status = "running";
//     await task.save();

//     // Fetch subtasks in order
//     const subtasks = await Subtask.find({ task_id: taskId })
//       .sort({ order_index: 1 });

//     for (const subtask of subtasks) {
//         console.log("▶ Executing subtask:", subtask.agent_type, subtask._id);
        

//       await executeSubtask(subtask, task);
//       console.log("✅ Completed subtask:", subtask.agent_type);

//     }

//     // Finalize task
//     task.status = "completed";
//     await task.save();

//     return true;
//   } catch (error) {
//     console.error("Orchestrator Error:", error);
//     throw error;
//   }
// };

// const executeSubtask = async (subtask, task) => {

//   // 🔒 ALWAYS skip non-executable agents
//   if (subtask.agent_type === "task") {
//     console.log("⏭ Skipping task agent (planner/meta step)");

//     subtask.status = "completed";
//     subtask.output = { skipped: true, reason: "planner step" };
//     await subtask.save();
//     return;
//   }

//   subtask.status = "running";
//   await subtask.save();

//   const agentRun = await AgentRun.create({
//     subtask_id: subtask._id,
//     agent_type: subtask.agent_type,
//     status: "running",
//     started_at: new Date()
//   });

//   try {
//     let output;

//     switch (subtask.agent_type) {
//       case "knowledge":
//         output = await runKnowledgeAgent({
//           task,
//           description: subtask.description
//         });
//         break;

//       case "data":
//         output = await runDataAgent({
//           task,
//           description: subtask.description
//         });
//         break;

      
//       case "content":
//         output = await runContentAgent({ task });
//       break;

       
//       case "execution":
//         output = await runExecutionAgent({ task });
//         break;

//       default:
//         throw new Error(`Unknown agent type: ${subtask.agent_type}`);
//     }

//     subtask.output = output;
//     subtask.status = "completed";
//     await subtask.save();

//     agentRun.response_payload = output;
//     agentRun.status = "completed";
//     agentRun.finished_at = new Date();
//     await agentRun.save();

//   } catch (error) {
//     console.error("❌ Subtask execution failed:", error);

//     subtask.status = "failed";
//     await subtask.save();

//     agentRun.status = "failed";
//     agentRun.response_payload = { error: error.message };
//     agentRun.finished_at = new Date();
//     await agentRun.save();

//     throw error;
//   }
// };



const Task = require("../models/task.model");
const Subtask = require("../models/subtask.model");
const AgentRun = require("../models/agentRun.model");

const { runKnowledgeAgent } = require("./agent/knowledgeAgent.service");
const { runDataAgent } = require("./agent/dataAgent.service");
const { runContentAgent } = require("./agent/contentAgent.service");
const { runExecutionAgent } = require("./agent/executionAgent.service");

exports.runTaskOrchestrator = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const subtasks = await Subtask.find({ task_id: taskId }).sort("order_index");

  try {
    for (const subtask of subtasks) {
      subtask.status = "running";
      await subtask.save();

      const agentRun = await AgentRun.create({
        subtask_id: subtask._id,
        agent_type: subtask.agent_type,
        status: "running",
        started_at: new Date()
      });

      let output;

      switch (subtask.agent_type) {
        case "knowledge":
          output = await runKnowledgeAgent({ task });
          break;

        case "data":
          output = await runDataAgent({ task });
          break;

        case "content":
          output = await runContentAgent({ task });
          break;

        case "execution":
          output = await runExecutionAgent({ task });
          break;

        default:
          throw new Error(`Unknown agent type: ${subtask.agent_type}`);
      }

      subtask.status = "completed";
      subtask.output = output;
      await subtask.save();

      agentRun.status = "completed";
      agentRun.response_payload = output;
      agentRun.finished_at = new Date();
      await agentRun.save();
    }

    // ✅ ALL SUBTASKS COMPLETED
    task.status = "completed";
    await task.save();

  } catch (error) {
    console.error("❌ Orchestrator Error:", error.message);

    // 🔥 FAIL TASK CLEANLY
    task.status = "failed";
    await task.save();

    // Mark active subtask as failed
    await Subtask.updateMany(
      { task_id: taskId, status: "running" },
      { status: "failed" }
    );

    await AgentRun.updateMany(
      { status: "running" },
      {
        status: "failed",
        finished_at: new Date(),
        response_payload: { error: error.message }
      }
    );

    throw error;
  }
};

