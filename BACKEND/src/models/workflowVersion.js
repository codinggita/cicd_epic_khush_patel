const mongoose = require('mongoose');

const workflowVersionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: [true, 'Workflow reference is required'],
      index: true,
    },
    version: {
      type: Number,
      required: [true, 'Version number is required'],
    },
    instruction: {
      type: String,
      required: [true, 'Instruction is required'],
    },
    output: {
      type: String,
      required: [true, 'Output is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changeType: {
      type: String,
      enum: ['create', 'replace', 'patch'],
      default: 'replace',
    },
  }
);

// Compound index on workflowId and version to look up specific versions quickly
workflowVersionSchema.index({ workflowId: 1, version: 1 }, { unique: true });

const WorkflowVersion = mongoose.model('WorkflowVersion', workflowVersionSchema);

module.exports = WorkflowVersion;
