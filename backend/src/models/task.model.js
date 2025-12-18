const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    title: {
      type: String,
      required: true
    },

    task_type: {
      type: String,
      enum: ["analysis", "plan", "email", "writing", "code", "general"],
      default: "general"
    },

    userPrompt: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending"
    },

    result_summary: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
