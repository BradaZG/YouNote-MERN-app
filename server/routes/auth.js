require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // hash users passwords
const jwt = require('jsonwebtoken'); // auth token

const User = require('../models/user');

// create an user
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    res
      .status(500)
      .json({ msg: 'Password lenght must be greater than 6 characters...' });
    return;
  }

  let newUser = new User({
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    numNotes: 0,
  });

  newUser
    .save()
    .then((user) => {
      jwt.sign(
        {
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) throw err;
          res.send({
            token,
            user: { username: user.username },
          });
        }
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: `User ${error.keyValue['username']} already exists. Try logging in...`,
      });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(500).json({
          msg: 'No user with username: ' + username,
        });
      } else if (!bcrypt.compareSync(password, user.passwordHash)) {
        res.status(500).json({
          msg: 'Invalid password!',
        });
      }

      jwt.sign(
        {
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) throw err;
          res.send({
            token,
            user: { username: user.username },
          });
        }
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = router;
