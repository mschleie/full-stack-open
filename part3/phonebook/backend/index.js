require('dotenv').config()

const express = require('express')

const Person = require('./models/person')

// this is a backend using express
const app = express()

// use frontend build
app.use(express.static('dist'))

// middleware for handling json post data
app.use(express.json())

// morgan loggin middleware
const morgan = require('morgan')
// define morgan token for POST, override :method formatting
morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        // get data from post
        const data = req.body
        return JSON.stringify(data)
    } else {
        return req.method
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// not const, because we can update this list
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id":"4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/info", (request, response, next) => {
    // track datetime receiving the request
    const timestamp = new Date(Date.now())
    // count number of person entries in db
    Person.countDocuments()
        .then(result => {
            // build up string containing html with message and timestamp
            const message = `<p>Phonebook has info for ${result} persons</p>`
            const time = `<p>${timestamp}</p>`
            // sent html to client to be rendered
            response.send(message + time)

        })
        .catch(error => next(error))
})

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
    // find person by given id
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    // check if data was sent along with the request
    if (!body) {
        return response.status(400).json({
            error: "response body undefined"
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number is missing"
        })
    } else if(persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    } 
    else {
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(result => {
            console.log('person saved in db', result)
            response.json(result)
        })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const newNumber = request.body.number    
    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(400).end()
            }
            // if person exists, change the number
            person.number = newNumber
            return person.save().then(updated => {
                response.json(updated)
            })
        })
        .catch(error => next(error))
})

// define error handling middleware at the end after routing
const errorHandler = (error, request, response, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// connect server to port
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

