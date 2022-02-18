//User model
const mongoose = require('mongoose');
//to obtain secure random numbers
const bcrypt = require('bcryptjs');
const { stringify } = require('querystring');

//Schema definition
//Adding validate rule for email to be unique

const UserSchema = mongoose.Schema({
    name: string,
    surname: string,
    email: {type: string, required: true},
    password: {type: string, required: true},
    role: string,
    nation:string,
    city: string,
    prefix:string,
    phone: string,
    creationDate:string,
    status:string,
    hospital:string,
    specialization:string,
});

//Pre save hook, Used to hash the password
UserSchema.pre('save', function(next){
    console.log(this.password)
    if (!this.isModified('password')) {
        return next();
    }
    console.log(this.password)
    //Generate salt value
    bcrypt.genSalt(10, (err, salt) => {
        if (err){
            return next(err);
        }
        //use this salt value to hash password
        bcrypt.hash(this.password, salt, (err,hash) => {
            if (err){
                return next(err);
            }
            console.log(hash)
            this.password = hash;
            next();
        });
    });
});

//custom method to check the password correct when login
UserSchema.methods.isPasswordMatch = function(plainPassword, hashed, callback){
    bcrypt.compare(plainPassword, hashed, (err,isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
}


const User = mongoose.model('User',UserSchema);
module.exports = User;