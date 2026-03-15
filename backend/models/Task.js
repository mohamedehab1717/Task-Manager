const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Done"],
    default: "Pending"
  },

  deadline: {
    type: Date
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  tag: {
    type: String,
    default: ""
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);