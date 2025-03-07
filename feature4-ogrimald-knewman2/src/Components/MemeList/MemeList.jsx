import React, { useEffect, useState } from "react";
import { createMeme, getAllMemes } from "../../Services/Memes.jsx";
import MemeEntry from "./MemeEntry.jsx"; // Child component
import NewMeme from "./NewMeme.jsx"; // Import the NewMeme component

export default function MemeList() {
  const [memes, setMemes] = useState([]);

  // Fetch memes when the component mounts
  useEffect(() => {
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

  // Function to add a new meme (called from the NewMeme child component)
  const handleAddMeme = async (name, era, url) => {
    try {
      // Create meme using the service function
      const newMeme = await createMeme(name, era, url);

      // Fetch the updated list of memes
      const data = await getAllMemes();
      setMemes(data);  // Update the memes state with the new meme included
    } catch (error) {
      console.error("Error creating meme:", error);
    }
  };

  return (
    <div className="home-content">
      <h1>Meme List</h1>
      <p>Listing every meme database entry loaded from back4app. Create new memes with the form below, and they are automatically added to the database.</p>

      <NewMeme onAddMeme={handleAddMeme} />

      <h2>Existing Memes</h2>
      <div>
        {memes.length > 0 ? (
          memes.map((meme) => <MemeEntry key={meme.id} meme={meme} />)
        ) : (
          <p>Loading memes...</p>
        )}
      </div>
    </div>
  );
}