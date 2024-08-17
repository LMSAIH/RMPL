const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
  overall: {
    type: Number,
    required: true,
  },
  quality: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  workload: {
    type: Number,
    required: true,
  },
  subjects: {
    type: Array,
    required: true,
  },
  comments: [
    {
      author: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Professor", PostSchema);
