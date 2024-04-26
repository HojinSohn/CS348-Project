import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "../Style/Recipe.css";
import {useNavigate} from "react-router-dom";

const RecipeComponent = ({ userID, recipe , setRecipes}) => {
    const [expanded, setExpanded] = useState(false);
    const [toggleReview, setToggleReview] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const toggleInstructions = () => {
        setExpanded(!expanded);
    };

    const ReviewForm = () => {
        const [text, setText] = useState('');
        const [rating, setRating] = useState(0); // Assuming 0 is the initial rating
        const [submitted, setSubmitted] = useState(false);

        const handleTextChange = (event) => {
            setText(event.target.value);
        };

        const handleRatingChange = (event) => {
            setRating(parseInt(event.target.value));
        };

        const handleSubmit = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/recipe/create-review/${recipe._id}/${userID}`,
                    {text: text, rating: rating}
                );
                setSubmitted(true); // For demonstration, marking as submitted
                setToggleReview(false);
            } catch (error) {
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
        };

        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Type your review here..."
                />
                <text>rating</text>
                <input
                    type="number"
                    value={rating}
                    onChange={handleRatingChange}
                    min="1"
                    max="5"
                    step="1"
                    style={{width: "100px", margin: "10px"}}
                />
                <button onClick={handleSubmit}>Submit</button>
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>{errorMessage}</h2>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const ReviewList = () => {
        const [reviews, setReviews] = useState([]);

        useEffect(() => {
            fetchReviews();
        }, []);

        const fetchReviews = async () => {
            try {
                // Make a GET request to fetch reviews from the server
                const response = await axios.get(`http://localhost:8080/recipe/view-reviews/${recipe._id}`);
                setReviews(response.data); // Assuming the response data is an array of reviews
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        return (
            <div>
                <h2>Reviews</h2>
                <span>{reviews.length}</span>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {reviews.map((review, index) => (
                        <li key={index} style={{ border: '1px solid #000', margin: '10px', padding: '10px' }}>
                            <p>User: {review.username}</p>
                            <p>Rating: {review.rating}</p>
                            <p>Text: {review.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const editRecipe = () => {
        navigate(`/edit-recipe/${recipe._id}`);
        console.log('Edit recipe clicked:', recipe._id);
    };

    const deleteRecipe = async () => {
        console.log('Edit recipe clicked:', recipe._id);
        try {
            const response = await axios.delete(`http://localhost:8080/recipe/delete/${recipe._id}`);
            console.log('Recipe deleted successfully:', recipe._id);
            if (response.data.isDeleted) {
                setRecipes(response.data.recipes);
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    return (
        <div className="recipe-container">
            <h2>{recipe.Title}</h2>
            {recipe.CreatedBy === localStorage.getItem("username") &&
                <div>
                    <p>you are the creator</p>
                    <button onClick={editRecipe}>
                        Edit
                    </button>
                    <button onClick={deleteRecipe}>
                        Delete
                    </button>
                </div>
            }
            <button onClick={() => {
                setToggleReview(!toggleReview);
            }}>
                review
            </button>
            {toggleReview &&
                <div>
                    <ReviewList></ReviewList>
                    <ReviewForm></ReviewForm>
                </div>
            }
            <button onClick={toggleInstructions}>
                {expanded ? 'Fold' : 'Expand'}
            </button>
            {expanded && (
                <div>
                    <p>Description: {recipe.Description}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        {recipe.Ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <div>
                        <h3>Instructions:</h3>
                        <p>{recipe.Instruction}</p>
                        <p>Created by: {recipe.CreatedBy}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeComponent;
