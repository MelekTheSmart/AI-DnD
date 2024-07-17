const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const {User} = require('../resource/model');

let sessionFn = session({secret: "monkey d. luffy", saveUninitialized: true, resave: false})

async function mkSession(req, res, next) {
  sessionFn(req, res, async (req, res) => {
    if (validateLogin(req, res)) {
      let user = await User.findOne({username: req.body.username})
      req.session.userId = user._id
      res.status(200).send("session created");
    }
  })
  next();
}

function validateLogin(req, res) {
  return true;
  // add validation logic later
}

function validateRequest(req, res, next) {
  sessionFn(req, res, () => {
    console.log(req.session.userID);
    console.log(req.session);
    if (req.session.userId) {
      res.status(200).send("logged in!");
    }
    res.status(400).send("not logged in");
  })
}

module.exports = {
  mkSession,
  validateRequest,
}
