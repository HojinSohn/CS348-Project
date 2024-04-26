import React, { useState } from 'react';
import '../Style/CreateComponent.css';
import IngredientItem from "./IngredientItems";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const CreateComponent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredient, setIngredient] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            try {
                const response = await axios.post(
                    "http://localhost:8080/recipe/create",
                    {
                        "userID": userID,
                        "title": title,
                        "description": description,
                        "instruction": instructions,
                        "ingredients": ingredients.toString(),
                    }
                );
                // Clear form fields
                setTitle('');
                setDescription('');
                setInstructions('');
                setIngredients([]);
                navigate('/');
            } catch (error){
                setShowPopup(true);
                if (error.response) {
                    const errorMessage = error.response.data.message;
                    console.error("Server error message:", errorMessage);

                    setShowPopup(true);
                    setErrorMessage(errorMessage);
                } else if (error.request) {
                    console.error("No response received from server");
                } else {
                    console.error("Error setting up request:", error.message);
                }
            }
        } else {
            setErrorMessage("Please fill in the all fields");
            setShowPopup(true);
        }
    };

    return (
        <div className="recipe-form">
            <div className="header">
                <button onClick={handleBack}>back</button>
                <h2>Add New Recipe</h2>
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
                            <h2>{errorMessage}</h2>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
                <button onClick={handleSubmit}>Add Recipe</button>
            </div>
        </div>
    );
};

export default CreateComponent;