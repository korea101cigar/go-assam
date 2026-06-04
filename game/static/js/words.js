const WORD_POOL = [
  "moon", "star", "wind", "rain", "cloud", "light", "shadow", "dream",
  "river", "ocean", "forest", "flower", "spring", "winter", "sunrise",
  "heart", "hope", "peace", "joy", "love", "grace", "faith", "truth",
  "whisper", "silence", "echo", "memory", "journey", "horizon", "twilight",
  "golden", "silver", "gentle", "brave", "quiet", "wild", "tender", "free",
  "bloom", "drift", "glow", "shine", "dance", "float", "wander", "rest",
  "stone", "leaf", "bird", "wave", "fire", "snow", "mist", "dawn",
  "spirit", "soul", "mind", "time", "path", "bridge", "door", "key",
  "song", "verse", "story", "magic", "secret", "gift", "wish", "starlight",
];

function pickRandomWord(exclude) {
  const used = new Set(exclude);
  const available = WORD_POOL.filter((w) => !used.has(w));
  const pool = available.length > 0 ? available : WORD_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}
