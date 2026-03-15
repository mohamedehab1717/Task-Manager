const express = require("express");
const router = express.Router();

const {
  addTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addTask);
router.get("/:projectId", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;