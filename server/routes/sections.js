const express = require("express");
const Section = require("../models/Section");
const Project = require("../models/Project");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET PROJECT SECTIONS
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

    const sections = await Section.find({
      project: project._id,
    }).sort({
      position: 1,
    });

    res.json(sections);
  } catch (error) {
    console.error("Fetch sections error:", error);
    res.status(500).json({
      message: "Failed to fetch sections",
    });
  }
});

// CREATE SECTION
router.post("/project/:projectId", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Section name is required",
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

    const lastSection = await Section.findOne({
      project: project._id,
    }).sort({
      position: -1,
    });

    const position = lastSection ? lastSection.position + 1 : 0;

    const section = await Section.create({
      name: name.trim(),
      project: project._id,
      position,
    });

    res.status(201).json(section);
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({
      message: "Failed to create section",
    });
  }
});

// UPDATE SECTION (Rename or change position)
router.patch("/:sectionId", protect, async (req, res) => {
  try {
    const { name, position } = req.body;

    const section = await Section.findById(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const project = await Project.findOne({
      _id: section.project,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Section name cannot be empty" });
      }
      section.name = name.trim();
    }

    if (position !== undefined) {
      section.position = position;
    }

    await section.save();

    res.json(section);
  } catch (error) {
    console.error("Update section error:", error);
    res.status(500).json({
      message: "Failed to update section",
    });
  }
});

// DELETE SECTION (Cascading: section and its tasks)
router.delete("/:sectionId", protect, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const project = await Project.findOne({
      _id: section.project,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Delete tasks belonging to this section
    await Task.deleteMany({
      section: section._id,
    });

    await section.deleteOne();

    res.json({
      message: "Section and its tasks deleted successfully",
      sectionId: section._id,
    });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(500).json({
      message: "Failed to delete section",
    });
  }
});

module.exports = router;
