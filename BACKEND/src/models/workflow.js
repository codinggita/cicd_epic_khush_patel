const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema(
  {
    instruction: {
      type: String,
      required: [true, 'Instruction is required'],
      trim: true,
    },
    output: {
      type: String,
      required: [true, 'Output is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced', 'expert'],
        message: 'Difficulty must be beginner, intermediate, advanced, or expert',
      },
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    runCount: {
      type: Number,
      default: 0,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [1.0, 'Rating must be at least 1.0'],
      max: [5.0, 'Rating cannot exceed 5.0'],
      index: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Create compound text index on instruction and output for full-text search capabilities
workflowSchema.index({ instruction: 'text', output: 'text' });

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
