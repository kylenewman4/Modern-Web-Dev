import React, { useEffect, useState } from "react";
import { createMeme, getAllMemes } from "../../Services/Memes.jsx";
import MemeEntry from "./MemeEntry.jsx";
import NewMeme from "./NewMeme.jsx";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

export default function MemeList() {
  const [memes, setMemes] = useState([]);
  const [selectedEra, setSelectedEra] = useState("");   // For era filtering
  const [eras, setEras] = useState([]);                 // List of available eras
  const [selectedSource, setSelectedSource] = useState(""); // For source filtering

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

  // get memes when the component mounts
  useEffect(() => {
    fetchMemes();
  }, [selectedEra]); // refetch memes when user selects a different era

  useEffect(() => {
    fetchEras();
  }, []);

  // fetch all memes or memes filtered by era
  async function fetchMemes() {
    try {
      const Meme = Parse.Object.extend("Meme");
      const query = new Parse.Query(Meme);

      if (selectedEra) {
        query.equalTo("era", selectedEra);
      }

      const results = await query.find();
      const memesData = results.map(meme => ({
        id: meme.id,
        name: meme.get("name"),
        era: meme.get("era"),
        url: meme.get("url"),
      }));

      setMemes(memesData);
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  }

  // fetch unique eras for dropdown
  async function fetchEras() {
    try {
      const Meme = Parse.Object.extend("Meme");
      const query = new Parse.Query(Meme);
      const results = await query.find();

      const uniqueEras = Array.from(new Set(results.map(meme => meme.get("era"))));
      setEras(uniqueEras);
    } catch (error) {
      console.error("Error fetching eras:", error);
    }
  }

  // add a new meme (called from the NewMeme child component)
  const handleAddMeme = async (name, era, url) => {
    try {
      // create meme object for new name
      await createMeme(name, era, url);
      await fetchMemes(); // refetch memes after adding a new one
      await fetchEras(); // update era list in case a new one was added
    } catch (error) {
      console.error("Error creating meme:", error);
    }
  };

  // filter memes by source
  const filteredMemes = memes.filter(meme => {
    if (!selectedSource) return true;

    const url = meme.url.toLowerCase();
    if (selectedSource === "youtube" && url.includes("youtube")) return true;
    if (selectedSource === "knowyourmeme" && url.includes("knowyourmeme")) return true;
    if (selectedSource === "other" && !url.includes("youtube") && !url.includes("knowyourmeme")) return true;
    return false;
  });

  return (
    <div className="home-content">
      <button onClick={handleLogout}>Logout</button>
      <h1>Meme List</h1>
      <p>Listing every meme database entry loaded from back4app. Create new memes with the form below, and they are automatically added to the database.</p>

      <NewMeme onAddMeme={handleAddMeme} />

      {/* Filters Section */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Filter by Era:
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="">All Eras</option>
            {eras.map((era, index) => (
              <option key={index} value={era}>{era}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Filter by Source:
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="">All Sources</option>
            <option value="youtube">YouTube</option>
            <option value="knowyourmeme">KnowYourMeme</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <h2>Existing Memes</h2>
      <div>
        {filteredMemes.length > 0 ? (
          filteredMemes.map((meme) => <MemeEntry key={meme.id} meme={meme} />)
        ) : (
          <p>No memes match the selected filters.</p>
        )}
      </div>
    </div>
  );
}