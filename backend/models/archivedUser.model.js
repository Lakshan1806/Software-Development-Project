import mongoose from 'mongoose';

const archivedUserSchema = new mongoose.Schema({
  originalId: String,
  username: String,
  email: String,
  phone: String,
  fullname: String,
  nicNumber: String,
  address: String,
  age: Number,
  photo: String,
  googleId: String,
  reasonForDeletion: String,
  deletedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ArchivedUser', archivedUserSchema);