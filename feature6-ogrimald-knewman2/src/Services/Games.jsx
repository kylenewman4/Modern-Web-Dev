import Parse from "parse";

const Env = {
  APPLICATION_ID: "nPvieL2fzxOb5pCM3vijxMyhyV7rjdwv3AmFDaNw",
  JAVASCRIPT_KEY: "zJ9PtsCNRyiYJNBfprgDyICsFktQSToeYWk3OHaU",
  SERVER_URL: "https://parseapi.back4app.com",
};

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

//get all games along with their associated meme (solution)
export function getAllGames() {
    const game = Parse.Object.extend("Game");
    const query = new Parse.Query(game);
    query.include("solution"); //makes sure the 'solution' pointer is resolved to the actual Meme object
    
    return query.find().then((results) => {
      return results.map((game) => {
        const meme = game.get("solution"); //returns Meme object from pointer
  
        return {
          id: game.id,
          date: game.get("createdAt"),
          name: game.get("name"),
          score: game.get("score"),
          solution: meme ? {
            id: meme.id,
            name: meme.get("name"),
            era: meme.get("era"),
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
    
    //convert the selected meme to a Parse Object pointer
    const memePointer = meme instanceof Parse.Object ? meme.toPointer() : Parse.Object.extend("Meme").createWithoutData(meme.id).toPointer();
    
    //set the solution field with the meme pointer
    game.set("solution", memePointer);
    
    try {
      const result = await game.save();
      return result;
    } catch (error) {
      console.error("Error creating game:", error);
      throw new Error("Error creating game: " + error.message);
    }
  }