const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware');
const jwt = require('jsonwebtoken')

blogsRouter.get("/", async (request, response, next) => {
  try {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  response.json(blogs);
  }catch(error) {
    next(error)
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body;
  const user = request.user
  if (!title || !url) {
    return response.status(400).json({ error: "title and url are required" });
  }
  if (!user) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" })
    }

    const user = request.user
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: "Unauthorized: not the owner of this blog" })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Update blog likes
blogsRouter.put("/:id", userExtractor, async (request, response, next) => {
  const { likes } = request.body;
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "Unauthorized: not the owner of this blog" })
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: "query" }
    );

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;