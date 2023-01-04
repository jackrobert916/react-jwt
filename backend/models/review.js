const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
    email: String,
    content: String,
    rate: String,
    company: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

ReviewSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ReviewSchema.index({
    content: 1,
    rate: 1,
});
const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;
