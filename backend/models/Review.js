/*
 * User.js
 */

const mongoose = require("mongoose");

const Review = new mongoose.Schema({
    UserID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    RecipeID: {
        type: mongoose.Types.ObjectId,
        ref: "Recipe"
    },
    Rating: {
        type: Number,
        required: [true, "rating required"],
    },
    Text: {
        type: String,
        required: [true, "text required"],
    },
})


const ReviewModel = mongoose.model("Review", Review);

module.exports = ReviewModel;