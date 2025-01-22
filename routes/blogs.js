const express = require("express");
const Blog = require("../models/Blog");
const { auth, checkRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, checkRole("Admin"), async (req, res) => {
  try {
    const blog = new Blog({ ...req.body, author: req.user._id });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

router.put("/:id", auth, checkRole("Editor"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog.assignedTo.equals(req.user._id)) throw new Error("Access denied");
    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

module.exports = router;
