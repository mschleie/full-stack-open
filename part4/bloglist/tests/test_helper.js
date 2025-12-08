const Blog = require('./../models/blog')
const User = require('./../models/user')

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const testBlogForDelete = {
  _id: "5a422bc61b54a676234d42fc",
  title: "To be deleted",
  author: "No one cares",
  url: "www.noonecares.com",
  lkes: 1,
  __v:0,
  user: "69368986dc0811bbfb12c578"
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const notExistingId = '123123123123123123123123'

const testUsers = [
  {
    _id: "69368986dc0811bbfb12c543",
    username: "t01",
    name: "TestUser-01",
    password: "test1234"
  },
  {
    _id: "69368986dc0811bbfb12c553",
    username: "t02",
    name: "TestUser-02",
    password: "4321test"
  }
]

const loginUser = {
  _id: "69368986dc0811bbfb12c578",
  username: "LoginUser",
  name: "User for Login",
  password: "loginTest"
}

const createLoginUser = async () => {
  const passwordHash = await bcrypt.hash(loginUser.password, 10)
  return {
    username: loginUser.username,
    name: loginUser.name,
    password: loginUser.password,
    passwordHash: passwordHash
  }
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { testBlogs, blogsInDB, notExistingId, testUsers, usersInDB, createLoginUser, loginUser, testBlogForDelete }