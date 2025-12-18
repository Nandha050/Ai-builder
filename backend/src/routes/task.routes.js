const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById
} = require("../controllers/task.controller");

const { protect } = require("../middlewares/auth.middleware");
// backend/src/routes/task.routes.js
const upload = require("../middlewares/upload");
const { streamTask } = require("../controllers/task.controller");

router.post(
  "/",
  protect,
  upload.array("files"), // 👈 MUST MATCH "files"
  createTask
);



router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/tasks/:id/stream", streamTask);
router.get("/:id", protect, getTaskById);

module.exports = router;
