const moongose = require("mongoose");

const articleModel = moongose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the title"]
    },
    content: {
        type: String,
        required: [true, "Please enter the content for the article "]
    },
    date: {
        type: Date,
        default: Date.now, // Sets to current time on creation
        min: '2020-01-01',
    }
})

module.exports = moongose.model("articleModel", articleModel);
