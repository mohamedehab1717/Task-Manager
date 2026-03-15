const Task = require("../models/Task");

exports.addTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, tag, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      tag,
      projectId
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};