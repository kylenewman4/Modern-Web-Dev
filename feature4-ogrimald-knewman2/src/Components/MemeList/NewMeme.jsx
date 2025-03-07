import React, { useState } from "react";

export default function NewMeme({ onAddMeme }) {
  const [name, setName] = useState("");
  const [era, setEra] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onAddMeme(name, era, url);
      // Clear the form after submission
      setName("");
      setEra("");
      setUrl("");
      setError(null);
    } catch (error) {
      setError("Error creating meme. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create a New Meme</h2>
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
            Era:
            <input
              type="text"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Add Meme</button>
      </form>
    </div>
  );
}