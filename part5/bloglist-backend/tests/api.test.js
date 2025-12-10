const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('./../app')

const Blog = require('./../models/blog')
const User = require('./../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.testBlogs)
  // for login
  await User.deleteMany({})
  // save user for login
  passwordHash = await bcrypt.hash(helper.loginUser.password, 10)
  loginUser = new User({
    _id: helper.loginUser._id,
    username: helper.loginUser.username,
    name: helper.loginUser.name,
    passwordHash: passwordHash
  })
  await loginUser.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.testBlogs.length)
})

test('blogs returned have id field instead of _id', async () => {
  const response = await api.get('/api/blogs')
  blogSample = response.body[0]
  assert(blogSample.hasOwnProperty('id'))
  assert(!blogSample.hasOwnProperty('_id'))
})

test('a blog can be added', async () => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  // new blog to be added
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test-author-blog.com',
    likes: 13
  }
  // post new blog and expect valid status code and content type
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  // retrive blogs incl new one
  const blogs = await helper.blogsInDB()
  const titles = blogs.map(blog => blog.title)
  // check if blog count increaded and new blog is available
  assert.strictEqual(blogs.length, helper.testBlogs.length + 1)
  assert(titles.includes('Test Blog'))
})

test('adding blog without login token results in 401', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test-author-blog.com',
    likes: 13
  }
  // post new blog and expect valid status code and content type
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${null}`)
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('a blog with no likes given is saved with zero likes', async () => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  // new blog without likes given
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test-author-blog.com'
  }
  // post new blog and check if saving works
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  // get all blogs and look if Test blog contains 0 likes
  const blogs = await helper.blogsInDB()
  const addedBlog = blogs.find((blog) => blog.title === 'Test Blog')
  assert.strictEqual(addedBlog.likes, 0)
})

test('a new blog must contain title', async () => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  // new blog without title
  const newBlog = {
    author: 'Test Author',
    url: 'www.test-author.com',
    likes: 13
  }
  // post new blog and expect error status
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  // check if no blog is added
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  assert(!blogs.map(blog => blog.author).includes('Test Author'))
})

test('a new blog must contain url', async () => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  // new blog without url
  const newBlog = {
    title: 'Test Title',
    author: 'Test Author',
    likes: 13
  }
  // post new blog and expect error status
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  // check if no blog is added
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  assert(!blogs.map(blog => blog.author).includes('Test Author'))
})

test('a new blog must contain title and url', async () => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  // new blog without title and url
  const newBlog = {
    author: 'Test Author',
    likes: 13
  }
  // post new blog and expect error status
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  // check if no blog is added
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  assert(!blogs.map(blog => blog.author).includes('Test Author'))
})

test('delete without login throws 401', async () => {
  await api
    .delete(`/api/blogs/${helper.testBlogs[0]._id}`)
    .set('Authorization', `Bearer ${null}`)
    .expect(401)
})

test('delete an existing blog', async () => {
  // add blog for loginUser
  await Blog.insertOne(helper.testBlogForDelete)
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  await api
    .delete(`/api/blogs/${helper.testBlogForDelete._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  // check if blog count decreased and deleted blog is not in db anymore
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  assert(!blogs.map(blog => blog.title).includes('To be deleted'))
})

test('delete a not existing blog', async() => {
  // login via test user
  const loggedIn = await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect('Content-Type', /application\/json/)
  // get token from login
  const token = loggedIn.body.token
  await api
    .delete(`/api/blogs/${helper.notExistingId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  // check if nothing changed
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
})

test('update likes of an existing blog', async () => {
  const update = {
    likes: 22
  }
  await api
    .put(`/api/blogs/${helper.testBlogs[0]._id}`)
    .send(update)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  // check if update worked
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  const updatedBlog = blogs.find(blog => blog.id === helper.testBlogs[0]._id)
  assert.strictEqual(updatedBlog.likes, 22)
})

test('update all fields of an existing blog', async () => {
  const update = {
    title: 'This title changed',
    author: 'This author changed',
    likes: 22
  }
  await api
    .put(`/api/blogs/${helper.testBlogs[0]._id}`)
    .send(update)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  // check if update worked
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  const updatedBlog = blogs.find(blog => blog.id === helper.testBlogs[0]._id)
  assert.strictEqual(updatedBlog.likes, 22)
  assert.strictEqual(updatedBlog.author, 'This author changed')
  assert.strictEqual(updatedBlog.title, 'This title changed')
  assert(!blogs.map(blog => blog.title).includes('React patterns'))
  assert(!blogs.map(blog => blog.author).includes('Michael Chan'))
})

test('update likes of not existing blog', async () => {
  const update = {
    likes: 22
  }
  await api
    .put(`/api/blogs/${helper.notExistingId}`)
    .send(update)
    .expect(404)
  // check nothing changed in db
  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.testBlogs.length)
  const updatedBlog = blogs.find(blog => blog.id === helper.testBlogs[0]._id)
  assert.strictEqual(updatedBlog.likes, helper.testBlogs[0].likes)
})

after(async () => {
  await mongoose.connection.close()
})