const mongoose = require('mongoose');

/*global process: true*/
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config();
}

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
