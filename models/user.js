//User model
const mongoose = require('mongoose');
//to obtain secure random numbers
const bcrypt = require('bcryptjs');
const { stringify } = require('querystring');

//Schema definition
//Adding validate rule for email to be unique

const UserSchema = new mongoose.Schema({
    name: {type:String, min:6},
    surname: {type:String, min:6},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true,min:6},
    role: String,
    //nation:String,
    country: 
        {
            type: mongoose.Schema.Types.String,
            ref : "Country"
        }
    ,
    prefix:String,
    phone: String,
    creationDate:{type:Date, default:Date.now},
    status:String,
    hospital:String,
    specialization:String,
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