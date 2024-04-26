const Ingredient = require("../models/Ingredient");

module.exports.createIngredient = async (req, res) => {
    try {
        const { name, category, measurementUnit } = req.body;

        // Prepared Statements: check if the name for ingredient is not too long
        if (name === undefined || name.length > 20 || name.length < 1) {
            return res.status(400).json({ message: "Ingredient name too long" });
        }

        // Index on name for Ingredients speed up the search.
        const existingIngredient = await Ingredient.findOne({ Name: name });
        if (existingIngredient) {
            return res.status(400).json({ message: "Ingredient already exists" });
        }
        const newIngredient = await Ingredient.create({
            Name: name,
            Category: category,
            MeasurementUnit: measurementUnit
        });
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteIngredient = async (req, res) => {
    try {
        const { name } = req.params;

        // Index on name for Ingredients speed up the search.
        await Ingredient.findOneAndDelete({ Name: name });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateIngredient = async (req, res) => {
    try {
        const { name } = req.params;
        const { category, measurementUnit } = req.body;

        // Index on name for Ingredients speed up the search.
        const updatedIngredient = await Ingredient.findOneAndUpdate({ Name: name }, {
            Category: category,
            MeasurementUnit: measurementUnit
        }, { new: true });
        res.status(200).json(updatedIngredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getIngredient = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};