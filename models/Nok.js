const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NokSchema = new Schema ({
	name: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    occupation: {
      type: String
    },
    relation: {
      type: String
    },
    email: {
      type: String
    }
});

module.exports = Nok = mongoose.model("noks", NokSchema);