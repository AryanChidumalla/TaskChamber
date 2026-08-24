const express = require("express");
const Project = require("../models/Project");
const Section = require("../models/Section");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET USER PROJECTS
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

// CREATE PROJECT
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      color: color || "#6366f1",
      owner: req.user._id,
    });

    // Create default sections for the new project
    const defaultSections = [
      { name: "To Do", position: 0 },
      { name: "In Progress", position: 1 },
      { name: "Completed", position: 2 },
    ];

    const sections = await Section.insertMany(
      defaultSections.map((section) => ({
        ...section,
        project: project._id,
      }))
    );

    res.status(201).json({
      project,
      sections,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      message: "Failed to create project",
    });
  }
});

// GET SINGLE PROJECT
router.get("/:projectId", protect, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const sections = await Section.find({
      project: project._id,
    }).sort({
      position: 1,
    });

    res.json({
      project,
      sections,
    });
  } catch (error) {
    console.error("Fetch single project error:", error);
    res.status(500).json({
      message: "Failed to fetch project",
    });
  }
});

// UPDATE PROJECT
router.patch("/:projectId", protect, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Project name cannot be empty" });
      }
      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description = description.trim();
    }

    if (color !== undefined) {
      project.color = color;
    }

    await project.save();

    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      message: "Failed to update project",
    });
  }
});

// DELETE PROJECT (Cascading: project, sections, tasks)
router.delete("/:projectId", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Delete all associated sections and tasks
    await Section.deleteMany({ project: project._id });
    await Task.deleteMany({ project: project._id });

    res.json({
      message: "Project and all associated data deleted successfully",
      projectId: project._id,
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      message: "Failed to delete project",
    });
  }
});

module.exports = router;
