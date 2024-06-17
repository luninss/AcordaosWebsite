const mongoose = require('mongoose');
const tribunal = require('../models/tribunal');

module.exports.list = async (page, limit) => {
  let data = await tribunal.find();
  return { data};
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

module.exports.insert = async (id) => {
  try {
    const newTribunal = new tribunal({
      tribunal: id,
    });
    console.log('Saving tribunal:', newTribunal);  // Debugging line
    return await newTribunal.save();
  } catch (error) {
    console.error('Error in insert controller:', error);  // Debugging line
    throw error;
  }
};
module.exports.delete = async id => {
  return await tribunal.deleteOne({ nome: id }).exec();
};
