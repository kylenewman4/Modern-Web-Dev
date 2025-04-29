import React, { useEffect, useState } from "react";
import { getAllGames } from "../../Services/Games.jsx"; // Import the Games service

const Leaderboard = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all games from the database and handle errors
    const fetchGames = async () => {
      try {
        const allGames = await getAllGames();
        
        // Sort games by score in descending order
        const sortedGames = allGames.sort((a, b) => b.score - a.score);
        setGames(sortedGames);
      } catch (err) {
        setError("Failed to fetch games.");
        console.error(err);
      }
    };

    fetchGames();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leaderboard</h2>
      <p>(SORTED BY DESCENDING SCORE)</p>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Game ID</th> {/* Added Game ID column */}
            <th>Game Name</th>
            <th>Score</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {games.length > 0 ? (
            games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td> {/* Displaying Game ID */}
                <td>{game.name}</td>
                <td>{game.score}</td>
                <td>{game.date ? game.date.toString() : 'N/A'}</td> {/* Display Created At */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No games found</td> {/* Adjusted colspan to 4 */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;