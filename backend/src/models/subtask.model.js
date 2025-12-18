const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    agent_type: {
      type: String,
      enum: ["task", "knowledge", "data", "content", "execution"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending"
    },

    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    order_index: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subtask", subtaskSchema);
