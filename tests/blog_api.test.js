const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id property exists in blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'this is a blog for testing',
      author: 'this is the blog author',
      url: 'this is the blog url'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'this is a blog for testing'
    )
  })

  test('likes defaults to 0 if mising', async () => {
    const newBlog = {
      title: 'this is a blog for testing',
      author: 'this is the blog author',
      url: 'this is the blog url'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('bad request if title or url are missing', async () => {
    const missingTitleBlog = {
      //title: 'this is a blog for testing',
      author: 'this is the blog author',
      url: 'this is the blog url'
    }

    await api
      .post('/api/blogs')
      .send(missingTitleBlog)
      .expect(400)

    const missingAuthorBlog = {
      title: 'this is a blog for testing',
      //author: 'this is the blog author',
      url: 'this is the blog url'
    }

    await api
      .post('/api/blogs')
      .send(missingAuthorBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const ids = blogsAtEnd.map(b => b.id)

    expect(ids).not.toContain(blogToDelete.id)
  })
})

describe('modification of a blog', () => {
  test('succeeds with status code 201', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToModify = {
      ...blogsAtStart[0],
      title: 'Modified title'
    }

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDB()

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Modified title')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})