/*
 * User.js
 */

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Your username is required"]
    },
    password: {
        type: String,
        required: [true, "Your password is required"]
    },
    RegistrationDate: {
        type: Date,
        default: new Date(),
    },
})

// Index on username
User.index({ username: 1 });

User.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const UserModel = mongoose.model("User", User);

module.exports = UserModel