const Recipe = require("../models/Recipe")
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const Review = require("../models/Review");
const mongoose = require("mongoose");

module.exports.createRecipe = async (req, res) => {
    // Transaction: start the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("create Recipe")
        const {userID, title, description, instruction, ingredients} = req.body;

        // Prepared Statements: check that the title is not empty and no longer than 20
        if (title === undefined || title.length > 40 || title.length < 1) {
            return res.status(400).json({message: "Title not allowed"});
        }

        // Prepared Statements: check that the description is not empty and no longer than 400
        if (description === undefined || description.length > 400 || description.length < 1) {
            return res.status(400).json({message: "Description Not allowed"});
        }

        // Prepared Statements: check that the instruction is not empty and no longer than 1500
        if (instruction === undefined || instruction.length > 1500 || instruction.length < 1) {
            return res.status(400).json({message: "Instruction not allowed"});
        }

        // Prepared Statements: check that the instruction is not empty and no longer than 1500
        if (ingredients === undefined || ingredients.length < 1) {
            return res.status(400).json({message: "Ingredients not allowed"});
        }

        const ingredientNameList = ingredients.split(',');

        // Concurrently search ingredients
        const ingredientObjects = await Promise.all(ingredientNameList.map(async (ingredient) => {
            // For each ingredient name, perform an asynchronous operation
            const ingredientObject = await Ingredient.findOne({ Name: ingredient.toLowerCase() });
            if (!ingredientObject) {
                // If ingredient not found, create a new one asynchronously
                return Ingredient.create({ Name: ingredient.toLowerCase() });
            }
            return ingredientObject; // Return found ingredient object
        }));

        const user = await User.findById(userID);
        const newRecipe = await Recipe.create({
            CreatedBy: user.username,
            Title: title,
            Description: description,
            Instruction: instruction,
            Ingredients: ingredientNameList,
        });

        // Transaction: commit the transaction
        await session.commitTransaction();
        return res.status(200).json({ //User Created.
            created: true,
            recipeID: newRecipe._id,
        });
    } catch (error) {
        // Transaction: abort the transaction
        await session.abortTransaction(); // abort the transaction
        return res.status(400).json({message: "Unexpected Error"});
    } finally {
        // Transaction: end the transaction
        await session.endSession();
    }
}

module.exports.deleteRecipe = async (req, res) => {
    const {recipeID} = req.params;
    console.log(recipeID);
    const recipe = await Recipe.findById(recipeID);
    if (recipe === null || recipe === undefined) {
        return res.status(400).json({isDeleted: false});
    }
    await Recipe.findByIdAndDelete(recipeID);
    const recipes = await Recipe.find();
    return res.status(200).json({isDeleted: true, recipes: recipes});
}

module.exports.updateRecipe = async (req, res) => {
    // Transaction: start the transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { recipeID } = req.params;
        const { userID, title, description, instruction, ingredients } = req.body;

        const ingredientNameList = ingredients.split(',');
        // Concurrently search ingredients
        const ingredientObjects = await Promise.all(ingredientNameList.map(async (ingredient) => {
            // For each ingredient name, perform an asynchronous operation
            const ingredientObject = await Ingredient.findOne({ Name: ingredient.toLowerCase() });
            if (!ingredientObject) {
                // If ingredient not found, create a new one asynchronously
                return Ingredient.create({ Name: ingredient.toLowerCase() });
            }
            return ingredientObject; // Return found ingredient object
        }));

        // Find the recipe by ID
        const existingRecipe = await Recipe.findById(recipeID);
        if (!existingRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const user = await User.findById(userID);

        if (existingRecipe.CreatedBy !== user.username) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        existingRecipe.Title = title;
        existingRecipe.Description = description;
        existingRecipe.Instruction = instruction;
        existingRecipe.Ingredients = ingredientNameList;
        await existingRecipe.save();

        // Transaction: commit the transaction
        await session.commitTransaction();

        return res.status(200).json({ updated: true, recipeID: existingRecipe._id });
    } catch (error) {
        // Transaction: abort the transaction
        await session.abortTransaction();
        console.error('Error updating recipe:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Transaction: end the transaction
        await session.endSession();
    }
};

module.exports.getRecipe = async (req, res) => {
    try {
        console.log("getRecipe: ", req.body);
        const {ingredients} = req.body;
        let recipes;

        if (ingredients === undefined || ingredients.length === 0) {
            recipes = await Recipe.find();
        } else {
            // Index on the Ingredients field speed up the searching
            recipes = await Recipe.find({ Ingredients: { $in: ingredients } });
        }

        return res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch recipes' });
    }
}

module.exports.getRecipeByID = async (req, res) => {
    try {
        // console.log("getRecipeByID: ", req.params);
        const {recipeID} = req.params;
        const recipe = await Recipe.findById(recipeID);
        // console.log(recipe);
        if (recipe === undefined || recipe === null) {
            return res.status(400).json({message: 'Failed to find a recipe'});
        }
        return res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch recipes' });
    }
}

module.exports.createReview = async (req, res) => {
    const { userID, recipeID } = req.params;
    const { text, rating } = req.body;

    // Prepared Statements: Check that rating and text exist and the text is not empty for review
    if (rating === undefined || text === undefined || text.length < 1) {
        return res.status(400).json({ message: 'Input not allowed' });
    }

    try {
        const recipe = await Recipe.findById(recipeID);
        const user = await User.findById(userID);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const review = new Review({
            UserID: userID,
            RecipeID: recipeID,
            Text: text,
            Rating: rating,
        });

        await review.save();

        return res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports.viewReview = async (req, res) => {
    const { recipeID } = req.params;
    console.log(recipeID);

    try {
        const reviews = await Review.find({ RecipeID: recipeID });

        // Array to store modified reviews with username
        const reviewsWithUsername = [];

        // Fetch username for each review
        for (const review of reviews) {
            const user = await User.findById(review.UserID);
            const reviewWithUsername = {
                _id: review._id,
                text: review.Text,
                rating: review.Rating,
                username: user ? user.username : null // Add username to the review object, or null if user not found
            };
            reviewsWithUsername.push(reviewWithUsername);
        }

        return res.status(200).json(reviewsWithUsername);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};