const mongoose = require('mongoose')
const acordao = require('../models/acordao');

module.exports.list = async () => {
    return await acordao
      .find()
      .exec();
  }

module.exports.lookUp = async id => {
    return await acordao
      .findOne({ processo: id })
      .exec();
  }

module.exports.update = async (id, data) => {
  return await acordao
    .findOneAndUpdate({ processo : id }, data)
    .exec();
  }

module.exports.insert = async (data) => {
  var newAcordao = new acordao(data);
  return newAcordao.save();
  }

module.exports.delete = async id => {
  return await acordao
    .deleteOne
    ({ processo : id })
    .exec();
  }


