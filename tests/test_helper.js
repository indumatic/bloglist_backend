const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs, blogsInDB
}