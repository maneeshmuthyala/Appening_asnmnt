const express = require("express");
const Comment = require("../models/Comment");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const comment = new Comment({ ...req.body, userId: req.user._id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.userId.equals(req.user._id)) throw new Error("Access denied");
    await comment.remove();
    res.status(204).end();
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

module.exports = router;
