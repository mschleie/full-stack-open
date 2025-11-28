const mongoose = require('mongoose')

// no password given
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.mmoe8ip.mongodb.net/?appName=Cluster0`

// otherwise only fields specified in schema would be saved
mongoose.set('strictQuery', false)

// family := IPv4
mongoose.connect(url, {family: 4})

// define schema for saving person data
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
// define model of schema
const Person = mongoose.model('Person', personSchema)

// if person data given, add new person to db
if (process.argv.length == 5) {
    // get person data from cmd arguments
    const personToAdd = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    // save person to db
    personToAdd.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else if (process.argv.length == 3) {
    // list all persons in db
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}