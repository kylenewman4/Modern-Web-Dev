import React, { useState, useRef } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import { createGame } from "../../Services/Games.jsx";
import { getAllMemes } from "../../Services/Memes.jsx";
import Parse from "parse";

// Function to find intersections between words
const findIntersection = (grid, word, position, direction) => {
  for (let i = 0; i < word.length; i++) {
    const row = direction === "across" ? position.row : position.row + i;
    const col = direction === "across" ? position.col + i : position.col;
    if (row >= grid.length || col >= grid[row].length || (grid[row][col] !== null && grid[row][col] !== word[i])) {
      return false; // No intersection or invalid overlap
    }
  }
  return true; // Intersection is valid
};

const placeWord = (grid, word, position, direction) => {
  for (let i = 0; i < word.length; i++) {
    const row = direction === "across" ? position.row : position.row + i;
    const col = direction === "across" ? position.col + i : position.col;
    grid[row][col] = word[i]; // Place each letter in the grid
  }
};

const expandGrid = (grid, word, position, direction) => {
  const wordLength = word.length;
  const gridSize = grid.length;

  // Expanding grid if needed horizontally
  if (direction === "across" && position.col + wordLength > gridSize) {
    const newGrid = grid.map(row => [...row]);
    while (newGrid[0].length < position.col + wordLength) {
      newGrid.forEach(row => row.push(null));
    }
    return newGrid;
  }

  // Expanding grid if needed vertically
  if (direction === "down" && position.row + wordLength > gridSize) {
    const newGrid = [...grid];
    while (newGrid.length < position.row + wordLength) {
      newGrid.push(new Array(gridSize).fill(null));
    }
    return newGrid;
  }

  return grid;
};

// Function to get a random starting position
const getRandomPosition = (gridSize) => {
  return {
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize)
  };
};

// Function to ensure the words scatter evenly across the grid
const placeWordRandomly = (grid, word, wordPositions) => {
  const gridSize = grid.length;
  const direction = Math.random() > 0.5 ? "across" : "down";
  const position = getRandomPosition(gridSize);

  // Try multiple attempts to place the word with new intersections
  for (let attempt = 0; attempt < 100; attempt++) {
    if (findIntersection(grid, word, position, direction)) {
      grid = expandGrid(grid, word, position, direction);
      placeWord(grid, word, position, direction);
      wordPositions.push({ word, position, direction });
      break;
    }
  }

  return grid;
};

const scrambleWordsInClue = (clue) => {
    const words = clue.split(' '); // Split the clue into words
    const scrambledWords = words.map(word => scrambleWord(word)); // Scramble each word individually
    return scrambledWords.join(' '); // Join the scrambled words back together with spaces
  };
  
  // Scramble function for individual words
  const scrambleWord = (word) => {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Swap letters
    }
    return wordArray.join('');
  };
  
  export default function CrosswordGame() {
    const [crosswordData, setCrosswordData] = useState(null);
    const [selectedMemes, setSelectedMemes] = useState([]);
    const [allMemes, setAllMemes] = useState([]);
    const [error, setError] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(null); // Track the start time
    const crosswordRef = useRef();
  
    const startNewGame = async () => {
      console.log("Starting new game...");
      try {
        const memes = await getAllMemes();
        setAllMemes(memes);
        const selected = getRandomMemes(memes, 5); // Adjust the number as needed
        setSelectedMemes(selected);
  
        const createdGame = await createGame("Crossword Game", "0", selected[0]);
        setCurrentGameId(createdGame.id);
  
        // Set the start time when the game starts
        setStartTime(Date.now());
  
        generateCrossword(selected);
      } catch (err) {
        console.error("Error starting new game:", err);
        setError("Failed to start a new game");
      }
    };
  
    const getRandomMemes = (memes, count) => {
      const shuffled = [...memes].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
  
    const generateCrossword = (selected) => {
      let gridSize = 15;
      let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
      const wordPositions = [];
      const across = {};
      const down = {};
  
      selected.forEach((meme, idx) => {
        const answer = meme.name.replace(/\s+/g, "").toUpperCase();
        const scrambledAnswer = scrambleWord(answer); // Scramble the word while preserving spaces
        const clue = scrambleWordsInClue(meme.name); // Scramble the individual words of the clue
  
        // Ensure that position is assigned before placement
        let position = getRandomPosition(gridSize);
        if (!position) {
          console.error(`Failed to assign position for word: "${answer}"`);
          return;
        }
  
        let direction = Math.random() > 0.5 ? "across" : "down"; // Random direction
        let placed = false;
  
        // Try to place the word, checking for valid intersections
        for (let attempt = 0; attempt < 100 && !placed; attempt++) {
          for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
              position = { row, col };
              direction = Math.random() > 0.5 ? "across" : "down"; // Change direction dynamically
  
              if (findIntersection(grid, answer, position, direction)) {
                grid = expandGrid(grid, answer, position, direction);
                placeWord(grid, answer, position, direction);
                placed = true;
  
                const wordObject = { clue, answer, row: position.row, col: position.col };
                if (direction === "across") {
                  across[idx + 1] = wordObject;
                } else {
                  down[idx + 1] = wordObject;
                }
  
                wordPositions.push({ answer, position, direction });
                break;
              }
            }
            if (placed) break;
          }
        }
  
        if (!placed) {
          console.error(`Unable to place word: "${answer}" after retries.`);
        }
      });
  
      setCrosswordData({ across, down, grid });
    };
  
    const handleSubmit = async () => {
      if (!crosswordRef.current) return;
    
      const isCorrect = crosswordRef.current.isCrosswordCorrect();
      let score = isCorrect ? 100 : 0; // Start with a base score of 100 if the crossword is correct
    
      // Calculate time taken in seconds
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    
      // Subtract 5 points for every 10 seconds taken
      const timePenalty = Math.floor(timeTaken / 10) * 5; // 5 points penalty for every 10 seconds
      score = Math.max(0, 100 - timePenalty); // Ensure score never goes below 0
    
      // Save the score to the database
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Crossword Game</h2>
  
        <div style={{ marginBottom: "20px" }}>
          <h4>Game ID: {currentGameId}</h4>
          <h4>Score: {score}</h4>
        </div>
  
        <button onClick={startNewGame} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
          Start New Game
        </button>
  
        {crosswordData && (
          <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
            <div style={{ width: "500px" }}>
              <Crossword ref={crosswordRef} data={crosswordData} />
            </div>
          </div>
        )}
  
        <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
          Submit Crossword
        </button>
      </div>
    );
  }