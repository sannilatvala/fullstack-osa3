const express = require('express')
const morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary",
    number: "39-23-6423122",
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const updatedPerson = request.body

  const index = persons.findIndex(person => person.id === id);

  if (index !== -1) {
    persons[index] = { ...persons[index], ...updatedPerson }
    response.json(persons[index])
  } else {
    response.status(404).end();
  }
})

const generateId = () => {
  const min = 1
  const max = 1000000
  return Math.floor(Math.random() * (max - min) + min)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number is missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const timestamp = new Date()
  const entryCount = persons.length

  response.send(`<p>Phonebook has info for ${entryCount} people</p>
                  <p>${timestamp}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
