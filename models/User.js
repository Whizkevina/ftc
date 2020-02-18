const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  unit_id: {
    type: String
  },
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Dcn']
  },
  group: {
    type: String
  },
  vocal_part: {
    type: String,
    enum: ['Alto', 'Suprano', 'tenor']
  },
  rehearsal_location: {
    type: String,
    enum: ['Iyana', 'Isashi']
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);