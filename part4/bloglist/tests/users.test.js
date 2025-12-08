const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('./../app')

const User = require('./../models/user')
const helper = require('./test_helper')

const usersApi = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.testUsers)
})

test('get should return json', async () => {
  await usersApi
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('get should return all users', async () => {
  const respond = await usersApi.get('/api/users')
  assert.strictEqual(respond.body.length, helper.testUsers.length)
  assert(respond.body.map(user => user.username).includes(helper.testUsers[0].username))
})

test('create user with username and password', async () => {
  const newUser = {
    username: "t03",
    name: "TestUser-03",
    password: "t1e2s3t4"
  }

  const respond = await usersApi
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAfter = await helper.usersInDB()
  // one User more in db
  assert.strictEqual(usersAfter.length, helper.testUsers.length + 1)
  // this user was added
  assert(usersAfter.map(user => user.username).includes("t03"))
})

test('user creation fails without username or password', async () => {
  const newUser = {
    name: "Test User to Fail"
  }

  const respond = await usersApi
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAfter = await helper.usersInDB()
  // no user added
  assert.strictEqual(usersAfter.length, helper.testUsers.length)
  // this user not added
  assert(!usersAfter.map(user => user.name).includes("Test User to Fail"))
  // should return json with error message
  assert(respond.body.error.includes('username and password must be given'))
})

test('user creation fails with username or password less than 3 characters', async () => {
  const newUser = {
    username: "tf",
    name: "Test user to fail",
    password: "t1"
  }

  const respond = await usersApi
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAfter = await helper.usersInDB()
  // no user added
  assert.strictEqual(usersAfter.length, helper.testUsers.length)
  // this user not added
  assert(!usersAfter.map(user => user.name).includes("Test User to Fail"))
  // should return json with error message
  assert(respond.body.error.includes('username and password must contain at least 3 characters'))
})

after(async () => {
  await mongoose.connection.close()
})