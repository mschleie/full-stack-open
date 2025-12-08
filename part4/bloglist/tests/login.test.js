const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('./../app')
const bcrypt = require('bcrypt')

const User = require('./../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  
  // save user for login
  passwordHash = await bcrypt.hash(helper.loginUser.password, 10)
  loginUser = new User({
    username: helper.loginUser.username,
    name: helper.loginUser.name,
    passwordHash: passwordHash
  })
  await loginUser.save()
})

test('user can login', async () => {

  await api
    .post('/api/login')
    .send({ username: helper.loginUser.username, password: helper.loginUser.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})