const mongoose = require('mongoose');
const Review = require('../models/review');

const get = async (req, res) => {
  //const { currentUser } = req;
  const review = await Review.find();

  if (!review) {
    return res.status(400).json({
      status: false,
      error: 'Review doesn`t exist',
    });
  }

  return res.send({
    status: true,
    review,
  });
};

const create = async (req, res) => {
  //const { currentUser } = req;
  const review = new Review({
    ...req.body
  });
  review.save().catch((err) => {
    console.log('Review save err', err.message);
  });

  return res.send({
    status: true,
  });
};

module.exports = {
  get,
  create
};
