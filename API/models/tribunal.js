const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const TribunalSchema = new mongoose.Schema({
    tribunal: String,
    numero_acordaos:  Number
}, { collection: 'Tribunais' }) ;

module.exports = mongoose.model('tribunal', TribunalSchema);