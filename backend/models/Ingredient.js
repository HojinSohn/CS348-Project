/*
 * User.js
 */

const mongoose = require("mongoose");

const Ingredient = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "name is required"]
    },
    Category: {
        type: String,
        default: null,
    },
    MeasurementUnit: {
        type: String,
        default: "gram",
    },
})

Ingredient.index({ Name: 1 });

const IngredientModel = mongoose.model("Ingredient", Ingredient);

module.exports = IngredientModel;