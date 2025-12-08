const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error(error)

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username must be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    // return authorization.replace('Bearer ', '')
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  // call only if request.token is available
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id)
    } else {
      request.user = null
    }
  }
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }