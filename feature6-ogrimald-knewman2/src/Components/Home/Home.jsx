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
        <div className="container mt-5">
            {/* Center the Logout button */}
            <div className="d-flex justify-content-center mb-4">
                <button 
                    className="btn btn-danger btn-lg"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className="text-center">
                <h1 className="display-3 mb-3">Welcome to Meme Word Games!</h1>
                <h3 className="mb-3 text-muted">
                    Feature 6 by Kyle Newman (knewman2@nd.edu) and Owen Grimaldi (ogrimald@nd.edu)
                </h3>
                <p className="lead mb-5">
                    Challenge your meme knowledge with fun word games across different internet eras.
                </p>
            </div>
        </div>
    );
}