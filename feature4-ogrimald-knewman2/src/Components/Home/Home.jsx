import Parse from "parse";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await Parse.User.logOut(); // Log out the user
            navigate("/auth"); // Redirect to the auth page after logging out
        } catch (error) {
            console.error("Error logging out:", error);
            alert("There was an error logging out. Please try again.");
        }
    };

    return (
        <div className="home-content">
            <button onClick={handleLogout}>Logout</button>
            <h1>Welcome to Meme Word Games!</h1>
            <h3>Feature 4 by Kyle Newman (knewman2@nd.edu) and Owen Grimaldi (ogrimald@nd.edu)</h3>
            <h3>Challenge your meme knowledge with fun word games across different internet eras.</h3>
        </div>
    );
}