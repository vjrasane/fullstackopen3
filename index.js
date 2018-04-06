const express = require('express')
const fs = require('fs');
const dateFormat = require('dateformat');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

let persons = []
fs.readFile("persons.json", 'utf-8', (err, data) => {
  if(err) {
    return console.log(err);
  }
  persons = JSON.parse(data);
});


var format = "ddd mmm dS yyyy HH:MM:ss Z"

const generateId = () => {
  let maxId = persons.length > 0 ? persons.map(p => p.id).sort((a,b) => a - b).reverse()[0] : 1
  return Number(Math.floor((Math.random() * maxId * 10) + 1));
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'missing name or number'})
  }

  if(persons.find(p => p.name === body.name)) {
    return res.status(409).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  res.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  res.send(`<div><div>puhelinluettelossa ${persons.length} henkilön tiedot</div><div>${dateFormat(format)}</div></div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(person)
    res.json(person)
  else
    res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
