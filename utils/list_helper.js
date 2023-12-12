const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => cur.likes + acc, 0)
}

const favoriteBlog = (blogs) => {
  if(!blogs.length) return {}

  const favoriteBlog = blogs.reduce((acc, cur) => {
    return cur.likes > acc.likes ? cur : acc
  }, { likes: 0 })

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {

  if(!blogs.length) return {}

  let nBlogs = []

  blogs.forEach(blog => {
    const found = nBlogs.find(nb => nb.author === blog.author)
    if(found) nBlogs = nBlogs.map(nb => nb.author === found.author ? { ...found, blogs:found.blogs+1 }:nb)
    else nBlogs.push({ author: blog.author, blogs: 1 })
  })

  return nBlogs.reduce((acc, cur) => cur.blogs > acc.blogs ? cur : acc, { blogs:0 })
}

const mostLikes = (blogs) => {
  if(!blogs.length) return {}

  let nLikes = []

  //console.log(_.groupBy(blogs, 'author'))

  blogs.forEach(blog => {
    const found = nLikes.find(nl => nl.author === blog.author)
    if(found) nLikes = nLikes.map(nl => nl.author === blog.author ? { ...found, likes:found.likes+blog.likes }:nl)
    else nLikes.push({ author: blog.author, likes: blog.likes })
  })

  return nLikes.reduce((acc, cur) => cur.likes > acc.likes ?  cur : acc, { likes:0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

