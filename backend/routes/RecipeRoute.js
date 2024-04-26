const {createRecipe, createReview, viewReview, updateRecipe, deleteRecipe, getRecipe} = require("../Controllers/RecipeController");
const {getRecipeByID} = require("../controllers/RecipeController");
const router = require("express").Router();

router.post("/create", createRecipe);
router.delete("/delete/:recipeID", deleteRecipe);
router.put("/update/:recipeID", updateRecipe);
router.get("/:recipeID", getRecipeByID);
router.post("/", getRecipe);
router.post("/create-review/:recipeID/:userID", createReview);
router.get("/view-reviews/:recipeID/", viewReview);
module.exports = router;

/*
1. for project 2, do I need to finish orm, prepared statements, and stored procedures
2. orm, prepared statements, and stored procedures In MongoDB
3. Question about the relations (Ingredients and Recipe), can they change while working for project 3?
4. Ingredients first. Then recipe can add ingredients that are currently in the database?
 */