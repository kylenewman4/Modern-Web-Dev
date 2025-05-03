import React, { useEffect, useState } from "react";
import { createMeme, getAllMemes } from "../../Services/Memes.jsx";
import MemeEntry from "./MemeEntry.jsx";
import NewMeme from "./NewMeme.jsx";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

export default function MemeList() {
  const [memes, setMemes] = useState([]);
  const [selectedEra, setSelectedEra] = useState(""); // For era filtering
  const [eras, setEras] = useState([]); // List of available eras
  const [selectedSource, setSelectedSource] = useState(""); // For source filtering

  const navigate = useNavigate();
  
  // logout button logic -- log out user and redirect them to auth
  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("There was an error logging out. Please try again.");
    }
  };

  useEffect(() => {
    fetchMemes();
  }, [selectedEra]); // refetch memes when user selects a different era

  useEffect(() => {
    fetchEras();
  }, []);

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
        clue: meme.get("clue")
      }));
      setMemes(memesData);
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  }

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

  const handleAddMeme = async (name, era, url, clue) => {
    try {
      await createMeme(name, era, url, clue);
      await fetchMemes();
      await fetchEras();
    } catch (error) {
      console.error("Error creating meme:", error);
    }
  };

  const filteredMemes = memes.filter(meme => {
    if (!selectedSource) return true;
    const url = meme.url.toLowerCase();
    if (selectedSource === "youtube" && url.includes("youtube")) return true;
    if (selectedSource === "knowyourmeme" && url.includes("knowyourmeme")) return true;
    if (selectedSource === "other" && !url.includes("youtube") && !url.includes("knowyourmeme")) return true;
    return false;
  });

  return (
    <div className="mt-3 px-3">
      <button className="btn btn-danger float-right" onClick={handleLogout}>Logout</button>
      <div className="container text-center mt-4">
        <h1>Meme List</h1>
        <p>
          Listing every meme database entry loaded from back4app. Create new memes with the form below, and they are automatically added to the database.
        </p>

        <NewMeme onAddMeme={handleAddMeme} />

        {/* Filters Section */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <label className="mr-3">Filter by Era:</label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="form-control"
              style={{ width: "200px" }}
            >
              <option value="">All Eras</option>
              {eras.map((era, index) => (
                <option key={index} value={era}>{era}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-3">Filter by Source:</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="form-control"
              style={{ width: "200px" }}
            >
              <option value="">All Sources</option>
              <option value="youtube">YouTube</option>
              <option value="knowyourmeme">KnowYourMeme</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Meme Entries */}
        <h2 className="text-center mb-4">Existing Memes</h2>
        <div className="row">
          {filteredMemes.length > 0 ? (
            filteredMemes.map((meme) => (
              <div className="col-lg-4 col-md-6 mb-4" key={meme.id}>
                <MemeEntry meme={meme} />
              </div>
            ))
          ) : (
            <p>No memes match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}