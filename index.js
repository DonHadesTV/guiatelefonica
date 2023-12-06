const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
//Obtener todos los recursos de personas
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
//Info con cantidad de personas en la agenda y hora de la peticion
app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>`
    )
})
//Obtener un recurso de persona
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
//Eliminar recurso de persona
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
//Añadir un recurso de persona
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    const personExist = persons.find(person => person.name === body.name)

    if (!body.name) {
        return response.status(400).json({
            error: 'name required'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number required'
        })
    } else if (personExist) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running  on port ${PORT}`)
})