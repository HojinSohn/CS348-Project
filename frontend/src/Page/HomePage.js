import React from 'react';
import CreateComponent from "../Component/CreateComponent";
import RecipeListComponent from "../Component/RecipeListComponent";
import "../Style/HomePage.css";

const Home = () => {
    return (
        <div className="home-container">
            <RecipeListComponent/>
        </div>
    );
}

export default Home;