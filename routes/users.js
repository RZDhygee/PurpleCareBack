const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');
const {use} = require('passport');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

//Login
router.post('/auth', async (req, res) => {

    //check if the email exists
    const user = await User.findOne({
        email:req.body.email
    });
    if (!user) 
    return res.status(400).send('Email is not found');
    
    //password is correct
    const validPass = await bcrypt.compare(
        req.body.password, user.password
        );
    if (!validPass) 
    return res.status(400).send('Invalid password');

    //User is valid
    const ONE_WEEK = 3000; //token validity in seconds
            
    //create and assign the token
    const token = jwt.sign({_id: user._id}, process.env.SECRET,{expiresIn: ONE_WEEK});
    res.header('auth-token', token);
    
    let returnUser = {
        name: user.name, 
    }
    return res.send({
        success: true,
        user: returnUser,
        token
    })


});

//Registration doctor
router.post('/register', async (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        surname:req.body.surname,
        nation:req.body.nation,
        city:req.body.city,
        hospital:req.body.hospital,
        specialization:req.body.specialization,
        email:req.body.email,
        password:req.body.password
    });

    const email = req.body.email;
    const query = {email}

    //check if the user exists
    User.findOne(query,(err,user) => {
        //error during executing the query
        if (err){
            return res.send({
                success:false,
                message:'Error, please try again'
            });
        }
        if (user) {
            return res.send({
                success:false,
                message:'Error, email has been used'
            });
        }

    newUser.save((err,user) => {
        if (err){
            return res.send({
                success: false,
                message: 'Failed to save the user'+err
            });
        }
        res.send({
            success:true,
            message:'User saved',
            user
        });
    });
    });
});


//list of users
router.get('list', (req,res, next) => {
    User.find((err,users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error while retrieving the user'
            });
        }
        return res.send({
            success: true,
            users
        });
    });
});


//get user by id
router.post('getuser', (req, res, next) => {
    let _id = req.body.id;
    let query = {_id}
    console.log(query);
    User.findById(query, (err,user) => {
        if (err) {
            return res.send({
                success: false,
                message:'Error while retrieving user'
            });
        }
        return res.send({
            success: true,
            user
        });  
      });
});

module.exports = router;

