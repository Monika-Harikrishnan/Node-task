const mongoose = require('mongoose');
const moment = require('moment');

const RoleSchema = mongoose.Schema({
    role_name: String,
    createdAt: String,  
    updatedAt: String
},
{
    versionKey: false,
});


RoleSchema.pre('save', function (next) {
    const now = moment().format('DD-MM-YYYY HH:mm:ss');
    if (!this.createdAt) {
        this.createdAt = now;  
    }
    this.updatedAt = now;  
    next();
});

RoleSchema.pre('findOneAndUpdate', function (next) {
    const now = moment().format('DD-MM-YYYY HH:mm:ss');
    this._update.updatedAt = now;  
    next();
});

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
