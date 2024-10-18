const mongoose = require('mongoose');
const moment = require('moment'); 
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String, 
    phonenumber : String, 
    password : String,
    reenter_password : String,
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    createdAt : String , 
    updatedAt : String   
}, {
    versionKey: false,
});

UserSchema.pre('save', async function (next) {
    const user = this;
    const now = moment().format('DD-MM-YYYY HH:mm:ss');

    if (!this.createdAt) {
        this.createdAt = now;  
    }
    this.updatedAt = now;  
    
    if (user.password !== user.reenter_password) {
        return next(new Error('Passwords do not match'));
    }

    if (user.isModified('password')) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
        } catch (err) {
            return next(err);
        }
    }

    user.reenter_password = undefined;

    next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
    const now = moment().format('DD-MM-YYYY HH:mm:ss');
    this._update.updatedAt = now;  
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
