const express = require('express')
const app = express()

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

app.get("/info", (request, response) => {
    // track datetime receiving the request
    const timestamp = new Date(Date.now())
    // build up string containing html with message and timestamp
    const message = `<p>Phonebook has info for ${persons.length} persons</p>`
    const time = `<p>${timestamp}</p>`
    // sent html to client to be rendered
    response.send(message + time)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    // search for person with given id in db
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    // send person data iff person with given id exists in db
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    // search for persons with given id in db
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    // respond 204 in both cases, something was deleted and nothing was deleted
    response.status(204).end()
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
        const person = {
            id: Math.floor(Math.random() * 1000),
            name: body.name,
            number: body.number
        }
        // add to collection and respond newly created person
        persons = persons.concat(person)
        response.json(person)
    }
})

// connect server to port
const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

