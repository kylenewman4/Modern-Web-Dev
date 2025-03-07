import React from "react";

export default function MemeEntry({ meme }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h2>{meme.name}</h2>
      <p>Era: {meme.era}</p>
      <p>URL: {meme.url}</p>
    </div>
  );
}