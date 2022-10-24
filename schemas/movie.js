const mongoose =require('mongoose');

module.exports = mongoose.model(
  'Movie',
  new mongoose.Schema({
    tconst: String,
    titleType: String,
    primaryTitle: String,
    originalTitle: String,
    isAdult: String,
    startYear: String,
    endYear: String,
    runtimeMinutes: String,
    genres: String,
  })
);