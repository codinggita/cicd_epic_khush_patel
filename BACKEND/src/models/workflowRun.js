const mongoose = require('mongoose');

const workflowRunSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: [true, 'Workflow reference is required'],
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['running', 'completed', 'failed', 'cancelled'],
      default: 'running',
      index: true,
    },
    logs: {
      type: [String],
      default: [],
    },
    metrics: {
      durationMs: {
        type: Number,
        default: 0,
      },
      cpuUsagePercent: {
        type: Number,
        default: 0,
      },
      memoryUsageMb: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  }
);

const WorkflowRun = mongoose.model('WorkflowRun', workflowRunSchema);

module.exports = WorkflowRun;
