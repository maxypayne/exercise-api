const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log(req.headers.authorization);
  jwt.verify(req.headers['authorization'], process.env.AUTH_SECRET_KEY, (err, decoded) => {
    console.log({decoded})
    if(!err) {
      next();
    } else {
      res.json({errMessage: 'auth falied'});
    }
  });
};
