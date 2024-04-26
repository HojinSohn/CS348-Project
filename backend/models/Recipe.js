/*
 * User.js
 */

const mongoose = require("mongoose");

const Recipe = new mongoose.Schema({
    CreatedBy: {
        type: String,
        required: [true, "title is required"]
    },
    Title: {
        type: String,
        required: [true, "title is required"]
    },
    Description: {
        type: String,
        required: [true, "description is required"]
    },
    Instruction: {
        type: String,
        required: [false, "Instruction is required"] // need to change
    },
    Ingredients: [{
        type: String,
    }],
    ServingSize: {
        type: Number,
        required: [false, "serving size is not required"]
    },
    PreparationTime: {
        type: String,
        required: [false, "preparation time is not required"]
    },
    DietaryTags: [{
        type: String,
        default: null,
    }],
})

// Index the Ingredients field for faster searching
Recipe.index({ Ingredients: 1 });

const RecipeModel = mongoose.model("Recipe", Recipe);

module.exports = RecipeModel