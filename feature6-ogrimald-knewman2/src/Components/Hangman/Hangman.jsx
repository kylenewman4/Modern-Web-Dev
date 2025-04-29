import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";

import img0 from "../../images/0.jpg";
import img1 from "../../images/1.jpg";
import img2 from "../../images/2.jpg";
import img3 from "../../images/3.jpg";
import img4 from "../../images/4.jpg";
import img5 from "../../images/5.jpg";
import img6 from "../../images/6.jpg";

function Hangman({ maxWrong = 6 }) {
  const [nWrong, setNWrong] = useState(0);
  const [guessed, setGuessed] = useState(new Set());
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

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
      setAnswer(meme.get("name").toLowerCase());
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
  };

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
        disabled={guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  };

  const alternateText = `${nWrong} wrong guesses`;

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="mt-3 px-3">
      <button className="btn custom-btn float-right" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="mb-4">Hangman</h1>
      <img src={images[nWrong]} className="rounded mx-auto d-block" alt={alternateText} />
      <p className="text-center">Number Wrong: {nWrong}</p>

      {answer === guessedWord().join("") ? (
        <div className="alert alert-success text-center">
          <p>YOU WIN!</p>
          <p>Correct word is: {answer}</p>
        </div>
      ) : nWrong === maxWrong ? (
        <div className="alert alert-danger text-center">
          <p>YOU LOSE</p>
          <p>Correct word is: {answer}</p>
        </div>
      ) : (
        <div>
          <p className="hangman-word text-center fs-2">{guessedWord()}</p>
          <div className="d-flex flex-wrap justify-content-center">
            {generateButtons()}
          </div>
        </div>
      )}

      <button id="reset" className="btn custom-btn d-block mx-auto mt-3" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default Hangman;
