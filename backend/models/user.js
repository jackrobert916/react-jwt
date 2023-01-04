const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    profession: String,
    company: String,
    avartar: String,
    hash: String,
    salt: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

UserSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

UserSchema.index({name: 1, email: 1 });

const User = mongoose.model('user', UserSchema);

module.exports = User;
