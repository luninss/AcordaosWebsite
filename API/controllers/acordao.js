const mongoose = require('mongoose');
const acordao = require('../models/acordao');

module.exports.countByTribunal= async id => {
  return acordao.countDocuments({ tribunal: id }).exec();
};

module.exports.list = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await acordao.countDocuments();
  let data = await acordao.find().skip(skip).limit(limit).exec();

  // Format dates to DD-MM-YYYY
  data = data.map(item => {
    const formattedDate = new Date(item.data_acordao).toLocaleDateString('en-GB');
    return {
      ...item.toObject(),
      data_acordao: formattedDate
    };
  });

  return { data, total, totalPages: Math.ceil(total / limit) };
};

module.exports.lookUp = async id => {
  let data = await acordao.findOne({ _id: id }).exec();

  if (data) {
    const formattedDate = new Date(data.data_acordao).toLocaleDateString('en-GB');
    data = {
      ...data.toObject(),
      data_acordao: formattedDate
    };
  }

  return data;
};

module.exports.listByTribunal = async (id, page, limit) => {
  const skip = (page - 1) * limit;
  const total = await acordao.countDocuments({ tribunal: id });
  let data = await acordao.find({ tribunal: id }).skip(skip).limit(limit).exec();

  // Format dates to DD-MM-YYYY
  data = data.map(item => {
    const formattedDate = new Date(item.data_acordao).toLocaleDateString('en-GB');
    return {
      ...item.toObject(),
      data_acordao: formattedDate
    };
  });

  return { data, total, totalPages: Math.ceil(total / limit) };
}

module.exports.update = async (id, data) => {
  return await acordao.findOneAndUpdate({ _id: id }, data).exec();
};

module.exports.insert = async data => {
  var newAcordao = new acordao(data);
  return newAcordao.save();
};

module.exports.delete = async id => {
  return await acordao.deleteOne({ _id: id }).exec();
};

module.exports.getAcordaosByIds = async ids => {
  return await acordao.find({ _id: { $in: ids } }).exec();
};
