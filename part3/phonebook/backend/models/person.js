const mongoose = require('mongoose')

// otherwise only fields specified in schema would be saved
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

// connect to db via IPv4 (== family : 4)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

// define schema for saving person data
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 9, //8 numbers + the separating - character
    validate: {
      validator: (v) => /\d{2,3}-\d+/.test(v),
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Person phone number required']
  }
})
// change JSON return: _id Object to String and delte __v versioning
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
// export Person model
module.exports = mongoose.model('Person', personSchema)