const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const {validateEmail} = require('../../utils/validateEmail');

const user = new Schema({

    name: {
        type: String,
        required: true,
        minlength: [3, "Username must be at least 3 characters long"],
        trim: true,

    },
    email:{
        type: String,
required:true,
        unique:true,
        validate:[validateEmail, "Invalid email"]
    },
    password: {
        type:String,
        required:true,
        trim:true,
        minlength:[5, "Password must be at least 5 characters long"]
    },
    notes: String,
    phone: {
        type:Number
    },



})
/*
Before the user is saved, the password is hashed. We use bcrypt npm package.
isModified method: if the password has not been modified break the hashing. If user give new password, we create hash again.
 */
user.pre('save', function (next){
    if(!this.isModified('password'))
        return next()

    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
})
/*
After new user registration we check if email not exist in DB. If it exist, we send a error message.
err.code 11000 is a error value from mongoose and mean a break of unique rule.
 */
user.post('save', (err,doc,next)=>{
    if(err.code===11000){
        err.errors={email:{message:'Email already exist'}}
    }
    next();
})
/*
With this method we compare whether the password is correct.
This is a bcrypt method.
 */
user.methods = {
    comparePassword(password){
        return bcrypt.compareSync(password,this.password)
    }
}



const User = mongoose.model('User', user, 'Users')
module.exports = { User }