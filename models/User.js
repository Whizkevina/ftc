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
    },
    nok_name: {
      type: String
    },
    nok_address: {
      type: String
    },
    nok_phone: {
      type: String
    },
    nok_occupation: {
      type: String
    },
    nok_relation: {
      type: String
    },
    nok_email: {
      type: String
    },
    membership_status: {
      type: String,
      enum: ['member', 'ordained worker', 'pastorate']
    },
    leadership_status: {
      type: String,
      enum: ['choir master', 'part head']
    },
    sub_group: {
      type: String,
      enum: ['music team', 'praise team', 'legal team']
    },
    wsf_status: {
      type: String,
      enum: ['home provider', 'member', 'district coordinator']
    },
    new_birth_year: {
      type: String
    },
    holy_spirit_year: {
      type: String
    },
    lfc_joined_year: {
      type: String
    },
    ordination_year: {
      type: String
    },
    province: {
      type: String
    },
    district: {
      type: String
    },
    zone: {
      type: String
    },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);