exports.getHealth = (req, res) => {
  res.json({
    status: "OK",
    message: "FinTrack API is healthy 🚀"
  });
};