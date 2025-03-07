import Parse from "parse";

const Env = {
  APPLICATION_ID: "nPvieL2fzxOb5pCM3vijxMyhyV7rjdwv3AmFDaNw",
  JAVASCRIPT_KEY: "zJ9PtsCNRyiYJNBfprgDyICsFktQSToeYWk3OHaU",
  SERVER_URL: "https://parseapi.back4app.com",
};

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

// Get all games along with their associated memes (meme_bank)
// Get all games along with their associated meme (solution)
export function getAllGames() {
    const game = Parse.Object.extend("Game");
    const query = new Parse.Query(game);
    query.include("solution"); // This makes sure the 'solution' pointer is resolved to the actual Meme object
    
    return query.find().then((results) => {
      return results.map((game) => {
        const meme = game.get("solution"); // Now it should be the actual Meme object, not just a pointer
  
        return {
          id: game.id,
          name: game.get("name"),
          score: game.get("score"),
          solution: meme ? {
            id: meme.id,
            name: meme.get("name"),
            era: meme.get("era"), // Assuming you have an 'era' field in the Meme class
          } : null,
        };
      });
    });
  }

  export async function createGame(name, score, meme) {
    const Game = Parse.Object.extend("Game");
    const game = new Game();
    
    game.set("name", name);
    game.set("score", score);
    
    // Convert the selected meme to a Parse Object pointer
    const memePointer = meme instanceof Parse.Object ? meme.toPointer() : Parse.Object.extend("Meme").createWithoutData(meme.id).toPointer();
    
    // Set the solution field with the meme pointer
    game.set("solution", memePointer);
    
    try {
      const result = await game.save();
      return result;
    } catch (error) {
      console.error("Error creating game:", error);
      throw new Error("Error creating game: " + error.message);
    }
  }