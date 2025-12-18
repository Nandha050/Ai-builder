// routes/test.routes.js
const express = require("express");
const router = express.Router();
const { runDataAgent } = require("../services/agent/dataAgent.service");
const Task = require("../models/task.model");

router.get("/data-agent-test", async (req, res) => {
  const task = await Task.findOne();
  const output = await runDataAgent({
    task,
    description: "Read and analyze the CSV file"
  });
  res.json(output);
});

module.exports = router;
