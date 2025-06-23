const Blog = require('../models/blog')
const User = require('../models/user')

const BlogsInDb = async () => {
    const Blogs = await Blog.find({})
    return Blogs.map(blog => blog.toJSON())
  }
  
  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    BlogsInDb,
    usersInDb
  }