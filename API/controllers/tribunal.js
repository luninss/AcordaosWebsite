const mongoose = require('mongoose');
const tribunal = require('../models/tribunal');

module.exports.list = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await tribunal.countDocuments();
  let data = await tribunal.find().skip(skip).limit(limit).exec();
  return { data, total, totalPages: Math.ceil(total / limit) };
};

module.exports.lookUp = async id => {
  let data = await tribunal.findOne({ tribunal: id }).exec();

  if (data) {
    const formattedDate = new Date(data.data_tribunal).toLocaleDateString('en-GB');
    data = {
      ...data.toObject(),
      data_tribunal: formattedDate
    };
  }

  return data;
};

module.exports.update = async (id, data) => {
  return await tribunal.findOneAndUpdate({ tribunal: id }, data).exec();
};

module.exports.insert = async data => {
  var newtribunal = new tribunal(data);
  return newtribunal.save();
};

module.exports.delete = async id => {
  return await tribunal.deleteOne({ nome: id }).exec();
};
