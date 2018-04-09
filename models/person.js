const mongoose = require('mongoose');
const fs = require('fs');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  }
});

personSchema.statics.format = (p) => {
  return {
    name: p.name,
    number: p.number,
    id: p._id
  }
}

const Person = mongoose.model('Person', personSchema);

module.exports = Person
