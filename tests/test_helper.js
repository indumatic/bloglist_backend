const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'this is a blog title',
    author: 'this is the blog author',
    url: 'this is the blog url',
    likes: 0
  },
  {
    title: 'this is a blog title',
    author: 'this is the blog author',
    url: 'this is the blog url',
    likes: 0
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDB, usersInDb
}