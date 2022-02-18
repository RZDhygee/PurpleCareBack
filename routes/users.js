const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');
const {use} = require('passport');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');


//Login
router.post('auth', (req, res , next) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = {email}
    //check if the user exists
    User.finfOne(query, (err,user) => {
        //error during executing the query
        if (err){
            return res.send({
                success: false,
                message: 'Error, please try again'
            });
        }

        //No user match the search condition
        if (!user){
            return res.send({
                success: false,
                message: 'Error, Account not found '+req.body
            });
        }

        //check if the password is correct
        user.isPasswordMatch(password, user.password,(err,isMatch) => {
            
            //Invalid password
            if (!isMatch){
                return res.send({
                    success:false,
                    message: 'Error, Invalid Password'
                });               
            }

            //User is valid
            const ONE_WEEK = 3000; //token validity in seconds
            
            //generating the token
            const token = jwt.sign({user}, process.env.SECRET,{expiresIn: ONE_WEEK});
            
            //user is valid
            //this object is only used to remove the password from the returned fields
            let returnUser = {
                name: user.name,
                email: user.email,
                surname: user.surname,
                password: user.password,
                role: user.role,
                nation: user.nation,
                city:user.city,
                prefix:user.prefix,
                phone: user.phone,
                creationDate:user.creationDate,
                status:user.status,
                hospital:user.hospital,
                specialization:user.specialization,

            }

            //send the response back
            return res.send({
                success:true,
                user: returnUser,
                token
            });
        });
    });
});

//Registration doctor
router.post('/register', (req, res, next) => {
    let newUser = new User({
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



module.exports = router;

