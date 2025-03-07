import React, { useEffect, useState } from "react";
import { createGame, getAllGames } from "../../Services/Games.jsx";
import GameEntry from "./GameEntry.jsx";
import NewGame from "./NewGame.jsx";

export default function GameList() {
  const [games, setGames] = useState([]);

  //fetch games when the component mounts
  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getAllGames();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    }
    fetchGames();
  }, []);

  //function to add a new game (called from the NewGame child component)
  const handleAddGame = async (name, score, memeBank) => {
    try {
      // Create game using the service function
      await createGame(name, score, memeBank);

      // Fetch the updated list of games
      const data = await getAllGames();
      setGames(data); // Update the games state with the new game included
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="home-content">
      <h1>Game List</h1>
      <p>Listing every game database entry loaded from back4app. Meme solutions are automatically loaded from all Meme objects in the database.</p>

      <NewGame onAddGame={handleAddGame} />

      <h2>Existing Games</h2>
      <div>
        {games.length > 0 ? (
          games.map((game) => <GameEntry key={game.id} game={game} />)
        ) : (
          <p>Loading games...</p>
        )}
      </div>
    </div>
  );
}