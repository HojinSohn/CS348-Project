import React, {useEffect, useState} from 'react';
import '../Style/CreateComponent.css';
import IngredientItem from "../Component/IngredientItems";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const EditRecipePage = () => {
    const { recipeID } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/recipe/${recipeID}`); // Assuming '/recipes' is your API endpoint
                setTitle(response.data.Title);
                setDescription(response.data.Description);
                setInstructions(response.data.Instruction);
                setIngredients(response.data.Ingredients);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleAddIngredient = () => {
        if (ingredient.trim() !== '') {
            setIngredients([...ingredients, ingredient]);
            setIngredient('');
        }
    };

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    const handleBack = async () => {
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim() !== '' && description.trim() !== '' && instructions.trim() !== '' && ingredients.length > 0) {
            // call api for recipe TODO
            const userID = localStorage.getItem("userID");
            const response = await axios.put(
                `http://localhost:8080/recipe/update/${recipeID}`,
                {
                    "userID": userID,
                    "title": title,
                    "description": description,
                    "instruction": instructions,
                    "ingredients": ingredients.toString(),
                }
            );
            console.log(response.data);
            setTitle('');
            setDescription('');
            setInstructions('');
            setIngredients([]);
            navigate('/');
        } else {
            setShowPopup(true);
        }
    };

    return (
        <div className="recipe-form">
            <div className="header">
                <button onClick={handleBack}>back</button>
                <h2>Edit Recipe</h2>
            </div>
            <div>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Instructions:</label>
                    <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Ingredients:</label>
                    <input type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} />
                    <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
                </div>
                <div className="ingredients-option-list">
                    {ingredients.map((ingredient, index) => (
                        <IngredientItem
                            key={index}
                            name={ingredient}
                            onDelete={() => handleDeleteIngredient(index)}
                        />
                    ))}
                </div>
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Please fill in all fields</h2>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
                <button onClick={handleSubmit}>Edit Recipe</button>
            </div>
        </div>
    );
};

export default EditRecipePage;