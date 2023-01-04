const mongoose = require('mongoose');
const Post = require('../models/post');

const get = async (req, res) => {
  //const { currentUser } = req;
  const post = await Post.find();

  if (!post) {
    return res.status(400).json({
      status: false,
      error: 'Post doesn`t exist',
    });
  }

  return res.send({
    status: true,
    post,
  });
};

const create = async (req, res) => {
  //const { currentUser } = req;
  const post = new Post({
    ...req.body
  });
  post.save().catch((err) => {
    console.log('Post save err', err.message);
  });

  return res.send({
    status: true,
  });
};

module.exports = {
  get,
  create
};
