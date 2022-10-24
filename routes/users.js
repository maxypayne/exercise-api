const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const bcrypt = require('bcrypt');
const User = require('../schemas/user');
const checkAuth = require('../middlewares/check-auth')

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({email}).catch(err => console.log(err));
  if (user) {
    const { _id, email, password: userPasssword } = user;
    const isMatch = await bcrypt.compare(password, userPasssword).catch(err => console.log(err));
    if (isMatch) {
      const token = jwt.sign(
        { email, userId: _id },
        process.env.AUTH_SECRET_KEY,
        {expiresIn: '24h'}
      );
      return res.json({ jwt: token, email });
    } else {
      return res.json({errMessage: 'login or password is incorrect'});
    }
  } else {
    return res.json({errMessage: 'no user with this email'});
  }
});

router.post('/signup', async (req, res, next) => {
  const {email, password, ...rest} = req.body;
  const findUser = await User.findOne({email});
  if (!findUser) {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword) {
      const createUser = await new User({email, password: hashedPassword, ...rest}).save().catch(_ => null);
      return res.json(createUser ? { message: 'User created' } : { errMessage: 'Create user failed' });
    }
    return res.json({errMessage: 'Hash failed'});
  }
  return res.json({errMessage: 'This email already exists'})
});

router.post('/verifyToken', (req, res) => {
  jwt.verify(req.body.token, process.env.AUTH_SECRET_KEY, (err) => {
    console.log({err});
    res.json(!err);
  });
});

module.exports = router;
