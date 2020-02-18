const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ChoirSchema = ({
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
    }
});

module.exports = Choir = mongoose.model("choirs", ChoirSchema);
