const express = require('express');
const router = express.Router();
const Movie = require('../schemas/movie');
const checkAuth = require('../middlewares/check-auth')

router.post('/', checkAuth, async (req, res) => {
  const movies = await Movie.aggregate([{ $sample: { size: 20 } }]).catch(() => null);
  if (movies) {
    res.json(movies.reduce((acc, movie) => {
      const { _id, primaryTitle, originalTitle, startYear } = movie;
      return [...acc, {id: _id, primaryTitle, originalTitle, startYear}]
    } ,[]))
  } else {
    res.json({error: 'Une erreur est survenue'});
  }
});

router.post('/filter', checkAuth, async (req, res) => {
  const { filter } = req.body;
  const movies = await Movie.find({ $text: { $search: filter } }).limit(20).catch((err) => {
    console.log(err);
  });
  if (movies) {
    res.json(movies.reduce((acc, movie) => {
      const { _id, primaryTitle, originalTitle, startYear } = movie;
      return [...acc, {id: _id, primaryTitle, originalTitle, startYear}]
    } ,[]))
  } else {
    res.json({error: 'Une erreur est survenue'});
  }
});

router.post('/add', checkAuth, async (req, res) => {
  const { originalTitle, primaryTitle, startYear } = req.body;
  if (originalTitle && primaryTitle && startYear) {
    const newMovie = new Movie({ originalTitle, primaryTitle, startYear });
    const isAdded = await newMovie.save().catch(() => null);
    res.json(!!isAdded)
  } else {
    res.json(false);
  }
});

module.exports = router;
