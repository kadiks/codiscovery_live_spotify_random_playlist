const clean = (name) => {
  let cleaned = name.trim();
  const matches = cleaned.match(/(\(|-|pt\.)/i);
  if (matches !== null) {
    // console.log("matches", matches);
    const index = matches.index;
    cleaned = cleaned.substr(0, index).trim();
    // console.log("cleaned", cleaned);
  }
  return cleaned;
};

module.exports = { clean };
