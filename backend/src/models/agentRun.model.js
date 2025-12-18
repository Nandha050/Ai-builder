const mongoose = require("mongoose");

const agentRunSchema = new mongoose.Schema(
  {
    subtask_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtask",
      required: true
    },

    agent_type: {
      type: String,
      enum: ["task", "knowledge", "data", "content", "execution"],
      required: true
    },

    request_payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    response_payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running"
    },

    started_at: {
      type: Date,
      default: Date.now
    },

    finished_at: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgentRun", agentRunSchema);
