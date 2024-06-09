const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const AcordaoSchema = new mongoose.Schema({
    _id : ObjectId,
    processo:  String,
    data_acordao:  String,
    tribunal:  String, 
    relator:  String, 
    descritores:  [String], 
    numero_convencional:  String, 
    numero_documento:  String, 
    votacao:  String, 
    texto_integral:  String, 
    url:  String, 
    outros_campos: { 
        requerente:  String , 
        requerido:  String , 
        privacidade:  String , 
        normas_apreciadas:  String , 
        normas_julgadas_inconst:  String , 
        area_tematica_1:  String , 
        area_tematica_2:  String , 
        decisao:  String , 
        sumario:  String ,
    }
}, { collection: 'Acordaos' }) ;

module.exports = mongoose.model('acordao', AcordaoSchema);