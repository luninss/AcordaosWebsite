const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const TribunalSchema = new mongoose.Schema({
    tribunal: String,
}, { collection: 'Tribunais' }) ;

module.exports = mongoose.model('tribunal', TribunalSchema);