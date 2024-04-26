/*
 * User.js
 */

const mongoose = require("mongoose");

const IngredientRecipe = new mongoose.Schema({
    IngredientID: {
        type: mongoose.Types.ObjectId,
        ref: "Ingredient"
    },
    RecipeID: {
        type: mongoose.Types.ObjectId,
        ref: "Recipe"
    },
    Quantity: {
        type: Number,
        required: [true, "quantity required"],
    }
})


const IngredientRecipeModel = mongoose.model("IngredientRecipe", IngredientRecipe);

module.exports = {
    IngredientRecipe: IngredientRecipeModel
};