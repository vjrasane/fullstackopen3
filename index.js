const express = require('express')
const fs = require('fs');
const dateFormat = require('dateformat');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

var format = "ddd mmm dS yyyy HH:MM:ss Z"

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'missing name or number'})
  }

  Person
    .find({ name: body.name })
    .then(p => {
      if(!p || p.length === 0) {
        new Person({
          name: body.name,
          number: body.number})
            .save()
            .then(p => res.json(Person.format(p)));
      } else {
        res.status(409).json({error: 'name must be unique'})
      }
    });

})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'missing name or number'})
  }

  Person.update({ _id: req.params.id }, { $set: {
      name: body.name,
      number: body.number
    }
  })
  .then(p => res.json(Person.format(p)))
  .catch(er => {
    console.log(er);
    res.status(400).send({error: er})
  });
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(ps => res.json(ps.map(Person.format)));
})

app.get('/api/info', (req, res) => {
  Person
    .count({})
    .then(c => {
      // kamalaa
      res.send(`<div><div>puhelinluettelossa ${c} henkilön tiedot</div><div>${dateFormat(format)}</div></div>`)
    });
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(p => res.json(Person.format(p)))
    .catch(er => {
      console.log(er);
      res.status(400).send({ error: er})
    });
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .remove({ _id: req.params.id })
    .then(p => res.status(204).end());
})

const error = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
