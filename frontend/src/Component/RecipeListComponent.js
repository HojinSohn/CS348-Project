import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeComponent from "./RecipeComponent";
import IngredientItem from "./IngredientItems";
import "../Style/RecipeList.css";
import { useNavigate } from 'react-router-dom';
const RecipeListComponent = () => {
    const [recipes, setRecipes] = useState([]);
    const [refreshToggle, setRefreshToggle] = useState(false);

    const [inputValue, setInputValue] = useState('');
    const [ingredientsToInclude, setIngredientsToInclude] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);

    const userID = localStorage.getItem("userID");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/ingredient');
                setAvailableIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredients();
    }, []);

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = [...ingredientsToInclude];
        updatedIngredients.splice(index, 1);
        setIngredientsToInclude(updatedIngredients);
    };

    const handleCreateRecipe = async () => {
        navigate("/create-recipe");
    };


    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddIngredient = () => {
        if (inputValue.trim() !== '') {
            setIngredientsToInclude([...ingredientsToInclude, inputValue]);
            setInputValue('');
        }
    };

    const handleSearch = async () => {
        console.log(ingredientsToInclude);
        try {
            const response = await axios.post(
                'http://localhost:8080/recipe',
                {
                    ingredients: ingredientsToInclude
                },
            );
            setRecipes(response.data); // Set the fetched recipes to state
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };



    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.post('http://localhost:8080/recipe'); // Assuming '/recipes' is your API endpoint
                setRecipes(response.data); // Set the fetched recipes to state
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [refreshToggle]); // Empty dependency array ensures that the effect runs only once, equivalent to componentDidMount

    return (
        <div className="container">
            <div className="option-component-container">
                <h2>Ingredients List</h2>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter an ingredient"
                    />
                    <button onClick={handleAddIngredient}>Add</button>
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="display-wrapper">
                    <div className="available-ingredients">
                        <h3>Available Ingredients:</h3>
                        <ul>
                            {availableIngredients.map(ingredient => (
                                <li key={ingredient._id}>{ingredient.Name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="selected-ingredients">
                        <h3>Selected Ingredients (want to Include):</h3>
                        <div className="ingredients-list">
                            {ingredientsToInclude.map((ingredient, index) => (
                                <IngredientItem
                                    key={index}
                                    name={ingredient}
                                    onDelete={() => handleDeleteIngredient(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="create-button">
                    <button onClick={handleCreateRecipe}>Create New Recipe</button>
                </div>
            </div>

            <div className="recipe-list-container">
                <header>
                    <h1>Recipe</h1>
                </header>
                <button onClick={() => {setRefreshToggle(!refreshToggle)}}>refresh</button>
                <h2>Recipes:</h2>
                <div className="recipe-list">
                    {recipes.map((recipe, index) => (
                        <RecipeComponent
                            key={index}
                            recipe={recipe}
                            setRecipes={setRecipes}
                            userID={userID}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default RecipeListComponent;