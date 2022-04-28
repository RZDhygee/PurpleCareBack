const express = require('express');
const router = express.Router();
const Country = require('../models/country');
const passport = require('passport');
const {use} = require('passport');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonFile = require('../data.json');

//list of countries
//read json file
let rawData = fs.readFileSync('data.json');
let countries = JSON.parse(rawData);
router.get('/list', (req,res, next) => {
  Country.find((err) => {
      if (err) {
          return res.send({
              success: false,
              message: 'Error while retrieving the list'
          });
      }
      return res.send({
          success: true,
          countries
      });
  });
});

//add country
router.post('/add', (req, res, next) => {
    console.log(req.body)
      let newCountry = new Country({
        name: req.body.name,
        nicename: req.body.nicename,
        iso:req.body.iso,
        iso3: req.body.iso3,
        phonecode:req.body.phonecode,
        numcode:req.body.numcode,
        is_europe:req.body.is_europe,
        vat:req.body.vat
      });
      
    
      newCountry.save((err, country) => {
        if (err) {
        //  console.log(err);
          return res.send({
            success: false,
            message: 'Failed to save the country'
          });
        }
        if (!country) {
          return res.send({
            success: false,
            message: 'Error, Invalid country'
          });
        }
        res.send({
          success: true,
          message: 'country Saved',
          country
        });
      });
    });

module.exports = router;
