const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('./../models/blog')
const User = require('./../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user._id
    })
    const result = await blog.save()

    // save blog to user
    request.user.blogs = request.user.blogs.concat(result._id)
    await request.user.save()

    // populate result with user information
    const populated = await result.populate('user', { username: 1, name: 1})
    // success
    response.status(201).json(populated)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // check if token suits user who created blog
  blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    response.status(204).end() // if blogToDelete does not exist return also 204
  } else if (blogToDelete.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'user did not create this blog '})
  } else {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id) 
  // if id not in db return 404 error
  if (!blog) {
    response.status(404).end()
  }
  // update blog according request
  blog.title = body.title || blog.title
  blog.author = body.author || blog.author
  blog.url = body.url || blog.url
  blog.likes = body.likes || blog.likes
  // update using mongoose save and populate result for displaying user
  const result = await blog.save()
  const populated = await result.populate('user', { username: 1, name: 1})
  response.json(populated)
})

module.exports = blogsRouter