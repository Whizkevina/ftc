const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = ({
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
    }
});

module.exports = Work = mongoose.model("work", WorkSchema);