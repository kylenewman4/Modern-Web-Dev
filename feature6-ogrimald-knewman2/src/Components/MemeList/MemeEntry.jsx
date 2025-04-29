import React from "react";

export default function MemeEntry({ meme }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{meme.name}</h5>
        <p className="card-text"><strong>Era:</strong> {meme.era}</p>
        <p className="card-text"><strong>URL:</strong> <a href={meme.url} target="_blank" rel="noopener noreferrer">{meme.url}</a></p>
      </div>
    </div>
  );
}