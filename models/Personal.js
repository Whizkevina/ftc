const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PersonalSchema = new Schema({
  phone: {
      type: String
    },
    whatsapp_phone: {
      type: String
    },
    email: {
      type: String
    },
    contact_address: {
      type: String
    },
    pha: {
      type: String
    },
    dob: {
      type: String
    },
    wed_date: {
      type: String
    },
    marital_status: {
      type: String,
      enum: ['single', 'engaged', 'married']
    },
    work_status: {
      type: String,
      enum: ['employed', 'self employed', 'unemployed']
    },
    profession: {
      type: String
    },
    employer_name: {
      type: String
    },
    employer_address: {
      type: String
    },
    state_origin: {
      type: String
    },
    nationality: {
      type: String,
      default: 'Nigeria'
    }
});

module.exports = Personal = mongoose.model("personals", PersonalSchema);