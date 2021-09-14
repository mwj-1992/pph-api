const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  origin:{
    name: {type: String},
    url: {type :String}
  },
  location:{
    name: {type: String},
    url: {type :String}
  },
  image: {type: String},
  episode:[{type:String}],
  url:{ type: String},
 created: {type: Date, default: Date.now()},
});

schema.plugin(uniqueValidator);
module.exports =  mongoose.model('Ricknmorty', schema, 'Ricknmorty');
