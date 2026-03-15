const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {

    const { title, description, deadline } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      userId: req.user.id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json(error);
  }
};


exports.getProjects = async (req, res) => {
  try {

    const projects = await Project.find({ userId: req.user.id });

    res.json(projects);

  } catch (error) {
    res.status(500).json(error);
  }
};


exports.deleteProject = async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted" });

  } catch (error) {
    res.status(500).json(error);
  }
};


exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};