const express = require('express');
const router = express.Router();
const Movie = require('../schemas/movie');
const isLog = require('../middlewares/check-auth');

router.post('/:id', isLog, async (req, res) => {
  const { skip = 1 } = req.query;
  // const movies = await Movie.find().skip(+skip * 100).limit(20).catch((err) => {
  //   console.log(err);
  // });

  const movies = await Movie.aggregate([{ $sample: { size: 20 } }]).catch(() => null);
  if (movies) {
    res.json(movies)
  } else {
    res.json({error: 'Une erreur est survenue'});
  }
});

module.exports = router;