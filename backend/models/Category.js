const { mongoose } = require('../db');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'fish', 'small-animals', 'reptile', 'both'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    seasonalVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
