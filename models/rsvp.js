const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    userName: {type: Schema.Types.ObjectId, ref: 'User'},
    connectionName: {type: Schema.Types.ObjectId, ref: 'Connection'},
    rsvpNum: {type: Number, default: 0},
    response: {type: String}
});

//collection name is rsvps in NBAD db
module.exports = mongoose.model('Rsvp', rsvpSchema);