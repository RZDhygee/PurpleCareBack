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
let File = JSON.parse(rawData);
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
          File
      });
  });
});




module.exports = router;
