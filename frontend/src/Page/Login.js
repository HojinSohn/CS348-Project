import React, { useState } from "react";
import "../Style/Login.css";
import axios from "axios";
import PropTypes from "prop-types";

export default function Login({setToken}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Function to handle login
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            // Implement your login logic here
            const response = await axios.post(
                "http://localhost:8080/auth",
                {
                    "isLogin": true,
                    "username": username,
                    "password": password,
                }
            );
            const {token, isAuthenticated, userID} = response.data
            if (isAuthenticated) {
                setToken(token);
                localStorage.setItem("username", username);
                localStorage.setItem("userID", userID);
            }
            // Handle response data
        } catch (error) {
            setError("Invalid username or password");
        }
    };

    // Function to handle signup
    const handleSignup = async () => {
        // Implement your signup logic here
        console.log("Signing up...");
        try {
            const response = await axios.post(
                "http://localhost:8080/auth",
                {
                    "isLogin": false,
                    "username": username,
                    "password": password,
                }
            );
            console.log("response");
            const {userID, token, isAuthenticated} = response.data
            if (isAuthenticated) {
                setToken(token);
                localStorage.setItem("username", username);
                localStorage.setItem("userID", userID);
            }
            // Handle response data here if needed
        } catch (error) {
            console.error("Error signing up:", error);
            setError("Error signing up: " + error);
            if (error.response) {
                const errorMessage = error.response.data.message;
                setError("Error signing up: " + errorMessage);
            } else {
                setError("Error signing up");
            }
        }
    };

    return (
        <div className="screen">
            <div className="login-container">
                <h2>Login / Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    <button type="button" onClick={handleSignup}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};