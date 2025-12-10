const collection = require('lodash/collection')
const math = require('lodash/math')
const object = require('lodash/object')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
  // return null if blogs is empty
  if (!blogs || blogs.length < 1) {
    return null
  }
  result = blogs.reduce((acc, curr) => {
    // console.log('acc', acc)
    // console.log('curr', curr)
    return curr.likes > acc.likes ? curr : acc
  })
  return result
}

const mostBlogs = (blogs) => {
  // return null if blog list is empty
  if (!blogs || blogs.length < 1) {
    return null
  }

  // count blogs per author
  const blogsPerAuthor = collection.countBy(blogs, 'author')
  // console.log(blogsPerAuthor)

  // find author with most blogs
  const maxAuthor = math.maxBy(object.keys(blogsPerAuthor), (o) => blogsPerAuthor[o])

  // build result object
  result = { author: maxAuthor, blogs: blogsPerAuthor[maxAuthor]}
  // console.log(result)

  return result
}

const mostLikes = (blogs) => {
  // return null if blog list is empty
  if (!blogs || blogs.length < 1) {
    return null
  }

  // group blogs by author
  const blogsPerAuthor = collection.groupBy(blogs, 'author')
  console.log("BLOGS PER AUTHOR", blogsPerAuthor)

  // sum up likes of all blogs per author
  const likesPerAuthor = object.mapValues(blogsPerAuthor, (blogs) => {
    // console.log(blogs)
    const likes = math.sumBy(blogs, (blog) => blog.likes)
    // console.log(likes)
    return likes
  })
  // console.log("LIKES PER AUTHOR", likesPerAuthor)

  // find author with most likes and return
  const maxAuthor = math.maxBy(object.keys(likesPerAuthor), (author) => likesPerAuthor[author])
  // console.log("MAX LIKE AUTHOR", maxAuthor)

  // build result object
  result = { author: maxAuthor, likes: likesPerAuthor[maxAuthor]}
  console.log("MAX LIKE RESULT", result)

  return result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }