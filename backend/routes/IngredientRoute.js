const {createIngredient, deleteIngredient, getIngredient, updateIngredient} = require("../Controllers/IngredientController");
const router = require("express").Router();

router.post("/create", createIngredient);
router.delete("/delete", deleteIngredient);
router.put("/update", updateIngredient);
router.get("/", getIngredient);

module.exports = router;