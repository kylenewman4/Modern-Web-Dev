import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import { createGame } from "../../Services/Games.jsx";

import img0 from "../../images/0.jpg";
import img1 from "../../images/1.jpg";
import img2 from "../../images/2.jpg";
import img3 from "../../images/3.jpg";
import img4 from "../../images/4.jpg";
import img5 from "../../images/5.jpg";
import img6 from "../../images/6.jpg";

function Hangman({ maxWrong = 6 }) {
  const [nWrong, setNWrong] = useState(0);
  const [guessed, setGuessed] = useState(new Set()); // guessed letters
  const [answer, setAnswer] = useState(""); // selected random meme
  const [loading, setLoading] = useState(true);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null); // Track the start time
  const [playerName, setPlayerName] = useState(""); // Track the signed-in player's name
  const [gameStarted, setGameStarted] = useState(false);

  const images = [img0, img1, img2, img3, img4, img5, img6];
  const navigate = useNavigate();

  // fetching a meme randomly from back4app database
  const fetchRandomMeme = async () => {
    setLoading(true);
    try {
      const Meme = Parse.Object.extend("Meme");
      const query = new Parse.Query(Meme);
      const count = await query.count();
      const randomIndex = Math.floor(Math.random() * count);
      query.skip(randomIndex);
      query.limit(1);
      const results = await query.find();
      const meme = results[0];

      // For game object in database
      const user = Parse.User.current();
      const username = user ? user.get("username") : "Player";  // Default to "Player" if not signed in
      const createdGame = await createGame(`${username}'s Hangman`, "0", meme);
      setCurrentGameId(createdGame.id);
      // Set the start time when the game starts
      setStartTime(Date.now());

      setAnswer(meme.get("name").toLowerCase());
      setGameStarted(true);
    } catch (err) {
      console.error("Error fetching meme:", err);
      setAnswer("default word");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMeme();
  }, []);

  const resetGame = () => {
    setNWrong(0);
    setGuessed(new Set());
    fetchRandomMeme();
    setScore(0);
  };

  // Fetch the signed-in player's name (e.g., using Parse)
  useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      setPlayerName(user.get("username")); // Or any other field that contains the name
    }
  }, []);

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

  // show current state of word
  const guessedWord = () => {
    return answer
      .split("")
      .map((ltr) => (ltr === " " ? " " : guessed.has(ltr) ? ltr : "_"));
  };

  // for each guessed letter
  const handleGuess = (evt) => {
    const ltr = evt.target.value;
    setGuessed((prev) => new Set(prev.add(ltr)));
    if (!answer.includes(ltr)) {
      setNWrong((prev) => prev + 1);
    }
  };
  
  // the buttons of letters for the user 
  const generateButtons = () => {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr, index) => (
      <button
        key={index}
        value={ltr}
        onClick={handleGuess}
        className="btn btn-outline-secondary m-1"
        disabled={guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  };

  // submitting your score to database / leaderboard once finished
  const handleSubmit = async () => {
    let score = 0;
    if (answer === guessedWord().join("")) {
      // Start with full score if the hangman is correct
      score = 100;
  
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      const timePenalty = Math.floor(timeTaken / 10) * 5;
      score = Math.max(0, score - timePenalty);
  
      console.log("Game over! Final score:", score);
    }
    // else incorrect, so maintain score of 0
    else if (nWrong === maxWrong) {
      console.log("Game over! Final score:", score);
    }
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
  }

  const alternateText = `${nWrong} wrong guesses`;

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="mt-3 px-3">
      <button className="btn btn-danger float-right" onClick={handleLogout}>
        Logout
      </button>

      <h1>Hangman</h1>
      <div className="text-center mb-4">
        <h2>{playerName ? `${playerName}'s Hangman` : "Hangman Game"}</h2>
        <div className="mb-3">
          <h4>Game ID: {currentGameId}</h4>
          <h4>Score: {score}</h4>
        </div>
        <p className="lead text-muted">
          Scores are determined by the time taken to finish the hangman from its creation. Reaching the max guesses without getting the word will return a score of 0.
        </p>
      </div>
      
      {/* Hangman image */}
      <div className="text-center">
        <img src={images[nWrong]} className="img-fluid" alt={alternateText} />
        <p className="text-center mt-2">Number Wrong: {nWrong}</p>
      </div>

      {/* Winning or Losing Message */}
      {answer === guessedWord().join("") ? (
        <div className="alert alert-success text-center">
          <p className="fs-4">YOU WIN!</p>
          <p className="fs-5">Correct word is: {answer}</p>
        </div>
      ) : nWrong === maxWrong ? (
        <div className="alert alert-danger text-center">
          <p className="fs-4">YOU LOSE</p>
          <p className="fs-5">Correct word is: {answer}</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="hangman-word fs-2">{guessedWord()}</p>
          <div className="d-flex flex-wrap justify-content-center mb-4">
            {generateButtons()}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center mb-4">
        <button className="btn btn-secondary btn-lg" onClick={handleSubmit}>
          Submit Hangman
        </button>
      </div>
      {/* Reset Button */}
      <div className="text-center mt-4">
        <button id="reset" className="btn btn-primary btn-lg" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default Hangman;