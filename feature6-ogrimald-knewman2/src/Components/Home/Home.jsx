import Parse from "parse";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    // Logout button logic -- log out user and redirect them to auth
    const handleLogout = async () => {
        try {
            await Parse.User.logOut();
            navigate("/auth");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("There was an error logging out. Please try again.");
        }
    };

    return (
        <div className="mt-3 px-3">
            <button className="btn custom-btn float-right" onClick={handleLogout}>Logout</button>
            <h1 className="mb-3">Welcome to Meme Word Games!</h1>
            <h3>Feature 6 by Kyle Newman (knewman2@nd.edu) and Owen Grimaldi (ogrimald@nd.edu)</h3>
            <h3>Challenge your meme knowledge with fun word games across different internet eras.</h3>
        </div>
    );
}