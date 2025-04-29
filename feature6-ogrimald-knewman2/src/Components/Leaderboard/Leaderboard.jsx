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
    <div className="container mt-4">
      <h2 className="text-center">Leaderboard (All Games)</h2>
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Game ID</th>
            <th>Game Name</th>
            <th>Score</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {games.length > 0 ? (
            games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.name}</td>
                <td>{game.score}</td>
                <td>{game.date ? game.date.toString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No games found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;