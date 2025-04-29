import React, { useState } from "react";
import { randomWord } from './words';
import { useNavigate } from "react-router-dom";
import Parse from "parse";

function Hangman({ maxWrong = 6 }) {
  const [nWrong, setNWrong] = useState(0);
  const [guessed, setGuessed] = useState(new Set());
  const [answer, setAnswer] = useState(randomWord().toLowerCase());

  // reset the game and put things in default
  const resetGame = () => {
    setNWrong(0);
    setGuessed(new Set());
    setAnswer(randomWord().toLowerCase());
  };

  const navigate = useNavigate();
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

  /** guessedWord: show current-state of word */
  const guessedWord = () => {
    return answer
        .split("")
        .map(ltr => {
            if (ltr === " ") return " "; // always reveal spaces
            return guessed.has(ltr) ? ltr : "_"; // otherwise reveal guessed letters
    });
  }

  /** handleGuess: handle a guessed letter */
  const handleGuess = (evt) => {
    const ltr = evt.target.value;
    setGuessed(prev => new Set(prev.add(ltr)));
    if (!answer.includes(ltr)) {
      setNWrong(prev => prev + 1);
    }
  };

  /** generateButtons: return array of letter buttons to render */
  const generateButtons = () => {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr, index) => (
      <button
        key={index}
        value={ltr}
        onClick={handleGuess}
        disabled={guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  };

  const alternateText = `${nWrong} wrong guesses`;

  return (
    <div className="mt-3 px-3">
      <button className="btn custom-btn float-right" onClick={handleLogout}>Logout</button>
      <h1 className="mb-4">Hangman</h1>
      <p>Number Wrong: {nWrong}</p>

      {answer === guessedWord().join("") ? (
        <p className="alert alert-success">You WIN!</p>
      ) : nWrong === maxWrong ? (
        <div className="alert alert-danger">
          <p>YOU LOSE</p>
          <p>Correct Word is: {answer}</p>
        </div>
      ) : (
        <div>
          <p className="fs-2">{guessedWord()}</p>
          <div className="d-flex flex-wrap justify-content-center">
            {generateButtons()}
          </div>
        </div>
      )}

      <button id="reset" className="btn custom-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default Hangman;