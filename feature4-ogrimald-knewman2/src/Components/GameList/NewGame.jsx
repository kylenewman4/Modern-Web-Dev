import React, { useState, useEffect } from "react";
import { getAllMemes } from "../../Services/Memes.jsx"; // Import function to get memes
import Parse from "parse"; // Import Parse for creating pointers

export default function NewGame({ onAddGame }) {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [selectedMemes, setSelectedMemes] = useState([]); // Store selected meme objects (not just IDs)
  const [memes, setMemes] = useState([]); // To store all available memes for selection
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all memes when the component mounts
    async function fetchMemes() {
      try {
        const data = await getAllMemes();
        setMemes(data);
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    }
    fetchMemes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Pass the selected meme object (not an array) to createGame
      await onAddGame(name, score, selectedMemes[0]); // selectedMemes is now an array with one meme
      setName("");
      setScore("");
      setSelectedMemes([]);  // Reset meme selection
      setError(null);
    } catch (error) {
      setError("Error creating game. Please try again.");
    }
  };

  const handleSelectChange = (e) => {
    const selectedMemeId = e.target.value;  // Get the selected meme's ID
    const selectedMeme = memes.find((meme) => meme.id === selectedMemeId); // Find the meme object by ID
    setSelectedMemes([selectedMeme]); // Store the selected meme object
  };

  return (
    <div>
      <h2>Create a New Game</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Score:
            <input
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
            <label>Meme Solution:</label>
            <select
                value={selectedMemes[0]?.id || ""}
                onChange={handleSelectChange}
                required
            >
                {Array.isArray(memes) && memes.length > 0 ? (
                memes.map((meme) => (
                    <option key={meme.id} value={meme.id}>
                    {meme.name}
                    </option>
                ))
                ) : (
                <option disabled>No memes available</option>
                )}
            </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Add Game</button>
      </form>
    </div>
  );
}