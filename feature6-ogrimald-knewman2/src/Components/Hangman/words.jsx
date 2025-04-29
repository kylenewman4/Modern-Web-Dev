// JUST TESTING -- not used
var ENGLISH_WORDS = [
  "tralalero tralala",
  "Test",
  "trippi troppi",
  "tung tung sahur",
  "chimpanzini bananini",
  "bombombini gusini",
  "la vaca saturno",
  "bombardiro crocodilo",
  "brr brr patapim",
  "capuchino assassino",
  "frigo camelo",
  "trulimero trulicina"
]

function randomWord() {
  return ENGLISH_WORDS[Math.floor(Math.random() * ENGLISH_WORDS.length)];
}

export { randomWord };