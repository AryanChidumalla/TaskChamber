const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const Section = require("../models/Section");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET TASKS FOR PROJECT
router.get("/project/:projectId", protect, async (req, res) => {
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

    const tasks = await Task.find({
      project: project._id,
    }).sort({
      position: 1,
      createdAt: 1,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// CREATE TASK
router.post("/project/:projectId", protect, async (req, res) => {
  try {
    const { title, description, sectionId, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Find target section or default to first section of project
    let targetSectionId = sectionId;
    if (!targetSectionId) {
      const firstSection = await Section.findOne({ project: project._id }).sort({ position: 1 });
      if (firstSection) {
        targetSectionId = firstSection._id;
      } else {
        return res.status(400).json({ message: "No section found in project" });
      }
    }

    const section = await Section.findOne({
      _id: targetSectionId,
      project: project._id,
    });

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const lastTask = await Task.findOne({
      section: section._id,
    }).sort({
      position: -1,
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      project: project._id,
      section: section._id,
      position,
      priority: priority && ["low", "medium", "high", "urgent"].includes(priority.toLowerCase())
        ? priority.toLowerCase()
        : "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

// MOVE TASK (Change section and/or position)
router.patch("/:taskId/move", protect, async (req, res) => {
  try {
    const { sectionId, position } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (sectionId) {
      const section = await Section.findOne({
        _id: sectionId,
        project: project._id,
      });

      if (!section) {
        return res.status(404).json({
          message: "Destination section not found",
        });
      }
      task.section = section._id;
    }

    if (position !== undefined && typeof position === "number") {
      task.position = position;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Move task error:", error);
    res.status(500).json({
      message: "Failed to move task",
    });
  }
});

// UPDATE TASK
router.patch("/:taskId", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { title, description, priority, dueDate, completed, sectionId, position } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (priority !== undefined) {
      if (["low", "medium", "high", "urgent"].includes(priority.toLowerCase())) {
        task.priority = priority.toLowerCase();
      }
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    if (sectionId !== undefined) {
      const section = await Section.findOne({
        _id: sectionId,
        project: project._id,
      });
      if (section) {
        task.section = section._id;
      }
    }

    if (position !== undefined && typeof position === "number") {
      task.position = position;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

// DELETE TASK
router.delete("/:taskId", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully",
      taskId: req.params.taskId,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

module.exports = router;
