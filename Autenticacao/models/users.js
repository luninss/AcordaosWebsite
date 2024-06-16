const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const ObjectId = mongoose.Types.ObjectId

const UserSchema = new mongoose.Schema({
    username:  String,
    email: String,
    password:  String,
    nome: String,
    dataRegisto: Date,
    dataUltimoAcesso: Date,
    favoritos: [String],
    level: String,
}, { collection: 'Users' }) ;

UserSchema.plugin(passportLocalMongoose, {usernameField: 'username'});

module.exports = mongoose.model('user', UserSchema);