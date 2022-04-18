const mongoose = require('mongoose');
const { isObject } = require('util');
const { validate } = require('./user');

const CountrySchema = mongoose.Schema({
    iso :{type:String, required:true , max:2},
    name:{type:String, required:true , max:80},
    nicename:{type:String, required:true , max:80},
    iso3:{type:String, required:true , max:3},
    numcode:Number,
    phonecode:{type:Number, required:true},
    is_europe:Number,
    vat:Number,
});

const Country = mongoose.model('Country',CountrySchema);
module.exports = Country;