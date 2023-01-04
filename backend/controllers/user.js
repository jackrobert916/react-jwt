const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const { validationResult } = require('express-validator');

const api = require('../config/api');
const User = require('../models/user');

const signUp = async (req, res) => {
  console.log(req.body);
  const errors = validationResult({email: req.body.email, password: req.body.password});
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array(),
    });
  }

  const password = req.body.password;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  const _user = new User({
    ...req.body,
  });
  
  _user.salt = salt;
  _user.hash = hash;
  _user
    .save()
    .then((_res) => {
      const token = jwt.sign(
        {
          id: _res.id,
        },
        api.JWT_SECRET,

        {
          expiresIn: '30d', // expires in 365 days
        }
      );

      const myJSON = JSON.stringify(_res);
      const user = JSON.parse(myJSON);
      delete user.hash;
      delete user.salt;

      return res.send({
        status: true,
        data: {
          token,
          _user
        }
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: false,
        error: err.message,
      });
    });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: errors.array(),
    });
  }

  const { email, password } = req.body;

  const _user = await User.findOne({
    email: new RegExp(email, 'i')
  });

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user',
    });
  }

  if (_user.salt) {
    // Check password
    const hash = crypto
      .pbkdf2Sync(password, _user.salt.split(' ')[0], 10000, 512, 'sha512')
      .toString('hex');

    if (hash !== _user.hash) {
      return res.status(401).json({
        status: false,
        error: 'invalid_password!',
      });
    }
  }

  const token = jwt.sign({ id: _user.id }, api.JWT_SECRET, {
    expiresIn: '30d', // expires in 365 days
  });
  const myJSON = JSON.stringify(_user);
  const user = JSON.parse(myJSON);

  delete user.hash;
  delete user.salt;

  return res.send({
    status: true,
    accessToken: token,
    _user,
  });
};

const checkAuth = async (req, res, next) => {
  const bearerToken = req.get('Authorization');
  let token;
  if (bearerToken) {
    token = bearerToken.split(' ')[1];
  }

  let decoded;
  try {
    decoded = jwt.verify(token, api.JWT_SECRET);
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  } catch (err) {
    console.log('check verify error', err.message || err.msg);
    return res.status(401).send(err.message || 'check user error');
  }

  req.currentUser = await User.findOne({ _id: decoded.id }).catch((err) => {
    console.log('user find err', err.message);
  });

  if (req.currentUser) {
    console.info('Auth Success:', req.currentUser.email);
    next();
  } else {
    console.error('Valid JWT but no user:', decoded);
    res.status(401).send('invalid_user');
  }
};

const getMe = async (req, res) => {
  const { currentUser } = req;

  const myJSON = JSON.stringify(currentUser);
  const user = JSON.parse(myJSON);
  delete user.hash;
  delete user.salt;

  return res.json({
    status: true,
    user,
  });
};

const editMe = async (req, res) => {
  const { currentUser } = req;

  const editData = { ...req.body };

  // TODO: should limit the editing fields here
  delete editData.password;
  delete editData.avatar;

  if (editData.clearAvatar) {
    editData.avatar = '';
    delete editData.clearAvatar;
  } else if (req.file) {
    editData.avatar = req.file.location;
  }

  await User.updateOne(
    {
      _id: currentUser.id,
    },
    {
      $set: {
        ...editData,
      },
    }
  );

  const _user = await User.findOne({
    _id: currentUser.id,
    del: false,
  });

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user',
    });
  }
  return res.send({
    user: _user,
  });
};

module.exports = {
  login,
  signUp,
  checkAuth,
  getMe,
  editMe,
};
