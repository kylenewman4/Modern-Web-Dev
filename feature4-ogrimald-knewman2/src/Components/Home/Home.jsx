import Parse from "parse";
import React from "react";

export default function Home() {
    const handleLogout = () => {
        navigate("/auth");
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