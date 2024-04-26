import React from 'react';
import "../Style/IngredientItems.css"
const IngredientItem = ({ name, onDelete, amount}) => {
    return (
        <div className="ingredient-item">
            <span>{name}</span>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
};
export default IngredientItem;