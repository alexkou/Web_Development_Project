const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },

    usertype: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);