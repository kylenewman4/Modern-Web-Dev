import React from "react";

export default function GameEntry({ game }) {
  // ensure solution is defined (in case it's undefined)
  const meme = game.solution || null; 

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h2>{game.name}</h2>
      <p>Score: {game.score}</p>
      <h3>Solution:</h3>
      {meme ? (
        <div>
          <p>Name: {meme.name}</p>
          <p>Era: {meme.era}</p>
        </div>
      ) : (
        <p>No meme associated with this game.</p>
      )}
    </div>
  );
}