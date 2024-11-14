import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Image = mongoose.model('Image', imageSchema);
