const mongoose = require("mongoose");
const articleschema = mongoose.Schema({

    username: {
        type: String,
        require: [true, "Please enter the username "],
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: [true, "Email is already registered "]

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [5, 'Username must be at least 5 characters long']
    }

})
module.exports = mongoose.Model("articleschema", articleschema);