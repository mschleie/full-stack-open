const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./../utils/list_helper')

// test data
const blogs = [
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

// test section dummy function
describe('dummy', () => {

  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

})

// test section totalLikes function
describe('total likes', () => {

  test('when list has no blogs return 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7)
  })

  test('when list contains all test blog, sum all likes up', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
})

// test section favoriteBlog function
describe('favorite blog', () => {

  test('when list has no blogs return null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog return this', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([blogs[0]]), blogs[0])
  })

  test('when multiple blogs in list return with highest likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })
})

// test section mostBlogs function
describe('most blogs', () => {

  test('when a list has no blogs return null'), () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  }

  test('when a list contains only one blog return his author', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), {author: "Michael Chan", blogs: 1})
  })

  test('when all blogs in list return author with most blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: "Robert C. Martin", blogs: 3})
  })
})

// test section mostLikes function
describe('most likes', () => {

  test('when a list has no blogs return null', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })

  test('when a list contains only one blog return his author', () => {
    assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), { author: "Michael Chan", likes: 7 })
  })

  test('when all blogs in list return author with most likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Edsger W. Dijkstra", likes: 17 })
  })
})