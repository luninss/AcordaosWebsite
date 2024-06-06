const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const ObjectId = mongoose.Types.ObjectId

const UserSchema = new mongoose.Schema({
    _id : ObjectId,
    username:  String,
    hashedPassword:  String,
    name: String,
    level: String,
    favorites: [String],
}, { collection: 'Users' }) ;

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);