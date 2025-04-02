import React, { useEffect, useState } from "react";
import { createMeme, getAllMemes } from "../../Services/Memes.jsx";
import MemeEntry from "./MemeEntry.jsx";
import NewMeme from "./NewMeme.jsx";
import Parse from "parse";

export default function MemeList() {
  const [memes, setMemes] = useState([]);

  const handleLogout = () => {
    navigate("/auth");
  };

  //get memes when the component mounts
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

  //add a new meme (called from the NewMeme child component)
  const handleAddMeme = async (name, era, url) => {
    try {
      //create meme object for new meme
      const newMeme = await createMeme(name, era, url);

      //fetch current memes
      const data = await getAllMemes();
      setMemes(data);  //update the memes state with the new meme included
    } catch (error) {
      console.error("Error creating meme:", error);
    }
  };

  return (
    <div className="home-content">
      <button onClick={handleLogout}>Logout</button>
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