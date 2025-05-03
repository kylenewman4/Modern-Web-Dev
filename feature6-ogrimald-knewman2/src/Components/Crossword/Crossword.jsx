import React, { useState, useRef, useEffect } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import { createGame } from "../../Services/Games.jsx";
import { getAllMemes } from "../../Services/Memes.jsx";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

// detects if placement  is possible
const canPlaceWord = (grid, word, position, direction) => {
  for (let i = 0; i < word.length; i++) {
    const row = direction === 'across' ? position.row : position.row + i;
    const col = direction === 'across' ? position.col + i : position.col;
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) return false;
    const cell = grid[row][col];
    if (cell !== null && cell !== word[i]) return false;
  }
  return true;
};

// updated intersection logic. creates much more realistic boards
const findBestIntersectionPosition = (grid, word, bounds) => {
  const gridSize = grid.length;
  const positions = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const existingLetter = grid[row][col];
      for (let i = 0; i < word.length; i++) {
        if (existingLetter === word[i]) {
          const startRow = row - i;
          const startCol = col;
          if (canPlaceWord(grid, word, { row: startRow, col: startCol }, 'down')) {
            positions.push({ row: startRow, col: startCol, direction: 'down' });
          }
          const startRow2 = row;
          const startCol2 = col - i;
          if (canPlaceWord(grid, word, { row: startRow2, col: startCol2 }, 'across')) {
            positions.push({ row: startRow2, col: startCol2, direction: 'across' });
          }
        }
      }
    }
  }

  if (positions.length > 0) {
    const centerRow = (bounds.minRow + bounds.maxRow) / 2;
    const centerCol = (bounds.minCol + bounds.maxCol) / 2;
    positions.sort((a, b) => {
      const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol);
      const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol);
      return distA - distB;
    });
    return positions[0];
  }

  // fallback: place adjacent to bounding box instead of random
  const fallbackRow = Math.max(0, Math.min(gridSize - 1, bounds.maxRow + 1));
  const fallbackCol = Math.max(0, Math.min(gridSize - 1, bounds.maxCol + 1));
  return { row: fallbackRow, col: fallbackCol, direction: Math.random() > 0.5 ? 'across' : 'down' };
};

// places word on board
const placeWord = (grid, word, position, direction) => {
  for (let i = 0; i < word.length; i++) {
    const row = direction === "across" ? position.row : position.row + i;
    const col = direction === "across" ? position.col + i : position.col;
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      grid[row][col] = word[i];
    }
  }
};

// expands grid size as necessary to fit words
const expandGrid = (grid, word, position, direction) => {
  const wordLength = word.length;
  let newGrid = [...grid];
  const requiredRows = direction === "down" ? position.row + wordLength : grid.length;
  const requiredCols = direction === "across" ? position.col + wordLength : grid[0].length;
  while (newGrid.length < requiredRows) {
    newGrid.push(new Array(newGrid[0].length).fill(null));
  }
  while (newGrid[0].length < requiredCols) {
    newGrid.forEach(row => row.push(null));
  }
  return newGrid;
};

export default function CrosswordGame() {
  const [crosswordData, setCrosswordData] = useState(null);
  const [selectedMemes, setSelectedMemes] = useState([]);
  const [allMemes, setAllMemes] = useState([]);
  const [error, setError] = useState(null);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const crosswordRef = useRef();
  const navigate = useNavigate();

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
    const user = Parse.User.current();
    if (user) setPlayerName(user.get("username"));
  }, []);

  // create new game
  const startNewGame = async () => {
    try {
      const memes = await getAllMemes();
      setAllMemes(memes);
      const selected = getRandomMemes(memes, 8); // number of words per board
      setSelectedMemes(selected);
      const user = Parse.User.current();
      const username = user ? user.get("username") : "Player";
      const createdGame = await createGame(`${username}'s Crossword`, "0", selected[0]);
      setCurrentGameId(createdGame.id);
      setStartTime(Date.now());
      generateCrossword(selected);
    } catch (err) {
      console.error("Error starting new game:", err);
      setError("Failed to start a new game");
    }
  };

  // get words + clues
  const getRandomMemes = (memes, count) => {
    const shuffled = [...memes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // generates crossword data for use with react-crossword
  const generateCrossword = (selected) => {
    let gridSize = 15;
    let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    const across = {};
    const down = {};
    let bounds = { minRow: gridSize, maxRow: 0, minCol: gridSize, maxCol: 0 };

    selected.forEach((meme, idx) => {
      const answer = meme.name.replace(/\s+/g, "").toUpperCase();
      const clue = meme.clue || "No clue provided";
      const positionData = findBestIntersectionPosition(grid, answer, bounds);
      grid = expandGrid(grid, answer, positionData, positionData.direction);

      if (canPlaceWord(grid, answer, positionData, positionData.direction)) {
        placeWord(grid, answer, positionData, positionData.direction);

        bounds.minRow = Math.min(bounds.minRow, positionData.row);
        bounds.maxRow = Math.max(bounds.maxRow, positionData.row + (positionData.direction === 'down' ? answer.length : 1));
        bounds.minCol = Math.min(bounds.minCol, positionData.col);
        bounds.maxCol = Math.max(bounds.maxCol, positionData.col + (positionData.direction === 'across' ? answer.length : 1));

        const wordObject = { clue, answer, row: positionData.row, col: positionData.col };
        if (positionData.direction === 'across') {
          across[idx + 1] = wordObject;
        } else {
          down[idx + 1] = wordObject;
        }
        console.log(`Placed "${answer}" at (${positionData.row},${positionData.col}) ${positionData.direction}`);
      } else {
        console.error(`Failed to place "${answer}"`);
      }
    });

    setCrosswordData({ across, down, grid });
  };

  // score submission, calculates and updates score if game completed
  const handleSubmit = async () => {
    if (!crosswordRef.current) return;
    const isCorrect = crosswordRef.current.isCrosswordCorrect();
    let score = isCorrect ? 100 : 0;
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const timePenalty = Math.floor(timeTaken / 10) * 5;
    score = Math.max(0, score - timePenalty);

    try {
      const Game = Parse.Object.extend("Game");
      const query = new Parse.Query(Game);
      const game = await query.get(currentGameId);
      game.set("score", score.toString());
      await game.save();
      setScore(score);
      alert(`Crossword submitted! Your score: ${score}`);
    } catch (err) {
      console.error(err);
      alert("Error updating game score");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mt-3 px-3">
      <button className="btn btn-danger float-right" onClick={handleLogout}>Logout</button>
      <h1>Crossword</h1>
      <div className="text-center mb-4">
        <h2>{playerName ? `${playerName}'s Crossword` : "Crossword Game"}</h2>
        <div className="mb-3">
          <h4>Game ID: {currentGameId}</h4>
          <h4>Score: {score}</h4>
        </div>
        <p className="lead text-muted">
          Scores are determined by the time taken to finish the crossword. A submission with ANY mistakes will return a score of 0.
        </p>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-primary btn-lg" onClick={startNewGame}>Start New Game</button>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          {crosswordData && (
            <div className="d-flex justify-content-center">
              <Crossword ref={crosswordRef} data={crosswordData} />
            </div>
          )}
        </div>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-secondary btn-lg" onClick={handleSubmit}>Submit Crossword</button>
      </div>
    </div>
  );
}