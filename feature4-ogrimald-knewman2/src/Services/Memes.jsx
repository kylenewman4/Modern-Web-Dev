import Parse from "parse";

const Env = {
    APPLICATION_ID: "nPvieL2fzxOb5pCM3vijxMyhyV7rjdwv3AmFDaNw",
    JAVASCRIPT_KEY: "zJ9PtsCNRyiYJNBfprgDyICsFktQSToeYWk3OHaU",
    SERVER_URL: "https://parseapi.back4app.com",
  }

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

export function getAllMemes() {
  const meme = Parse.Object.extend("Meme");
  const query = new Parse.Query(meme);

  return query.find().then((results) => {
    return results.map((meme) => ({
      id: meme.id,
      name: meme.get("name"),
      era: meme.get("era"),
      url: meme.get("url")
    }));
  });
}

export async function createMeme(name, era, url) {
    const Meme = Parse.Object.extend("Meme");
    const meme = new Meme();

    meme.set("name", name);
    meme.set("era", era);
    meme.set("url", url);

    return meme.save().then((result) => {
        return result;
    });
}