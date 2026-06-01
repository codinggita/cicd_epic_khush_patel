const Workflow = require('../models/workflow');
const WorkflowVersion = require('../models/workflowVersion');
const WorkflowRun = require('../models/workflowRun');
const { applyQuery } = require('../utils/queryHelper');

/**
 * Service to manage workflow-related database logic.
 */
class WorkflowService {
  /**
   * Get all workflows with query filters, pagination, sort, search, and projection.
   */
  async getWorkflows(query) {
    // Only return non-archived workflows by default
    return await applyQuery(Workflow, query, { isArchived: false });
  }

  /**
   * Get a single workflow by ID.
   */
  async getWorkflowById(id) {
    const workflow = await Workflow.findOneAndUpdate(
      { _id: id, isArchived: false },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!workflow) {
      const error = new Error('Workflow not found or has been archived');
      error.statusCode = 404;
      throw error;
    }
    return workflow;
  }

  /**
   * Create a new workflow and log version 1.
   */
  async createWorkflow(data) {
    const workflow = await Workflow.create({
      instruction: data.instruction,
      output: data.output,
      topic: data.topic,
      difficulty: data.difficulty
    });

    // Create version 1 history
    await WorkflowVersion.create({
      workflowId: workflow._id,
      version: 1,
      instruction: workflow.instruction,
      output: workflow.output,
      topic: workflow.topic,
      difficulty: workflow.difficulty,
      changeType: 'create'
    });

    return workflow;
  }

  /**
   * Replace a workflow (PUT) and log a new version.
   */
  async replaceWorkflow(id, data) {
    const workflow = await Workflow.findOne({ _id: id, isArchived: false });
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    workflow.instruction = data.instruction;
    workflow.output = data.output;
    workflow.topic = data.topic;
    workflow.difficulty = data.difficulty;
    await workflow.save();

    // Determine the next version number
    const lastVersion = await WorkflowVersion.findOne({ workflowId: id }).sort('-version');
    const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

    // Create history entry
    await WorkflowVersion.create({
      workflowId: workflow._id,
      version: nextVersion,
      instruction: workflow.instruction,
      output: workflow.output,
      topic: workflow.topic,
      difficulty: workflow.difficulty,
      changeType: 'replace'
    });

    return workflow;
  }

  /**
   * Patch workflow content and log a new version.
   */
  async patchWorkflowContent(id, data) {
    const workflow = await Workflow.findOne({ _id: id, isArchived: false });
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    // Apply only provided fields
    if (data.instruction !== undefined) workflow.instruction = data.instruction;
    if (data.output !== undefined) workflow.output = data.output;
    if (data.topic !== undefined) workflow.topic = data.topic;
    if (data.difficulty !== undefined) workflow.difficulty = data.difficulty;
    
    await workflow.save();

    // Determine the next version number
    const lastVersion = await WorkflowVersion.findOne({ workflowId: id }).sort('-version');
    const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

    // Create history entry
    await WorkflowVersion.create({
      workflowId: workflow._id,
      version: nextVersion,
      instruction: workflow.instruction,
      output: workflow.output,
      topic: workflow.topic,
      difficulty: workflow.difficulty,
      changeType: 'patch'
    });

    return workflow;
  }

  /**
   * Delete a workflow permanently.
   */
  async deleteWorkflow(id) {
    const workflow = await Workflow.findByIdAndDelete(id);
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }
    // Clean up versions and runs
    await Promise.all([
      WorkflowVersion.deleteMany({ workflowId: id }),
      WorkflowRun.deleteMany({ workflowId: id })
    ]);
    return workflow;
  }

  /**
   * Get a random workflow from the database.
   */
  async getRandomWorkflow() {
    const count = await Workflow.countDocuments({ isArchived: false });
    if (count === 0) {
      const error = new Error('No workflows available');
      error.statusCode = 404;
      throw error;
    }
    const randomIndex = Math.floor(Math.random() * count);
    const randomDoc = await Workflow.findOne({ isArchived: false }).skip(randomIndex);
    return randomDoc;
  }

  /**
   * Get latest workflows.
   */
  async getLatestWorkflows(limit = 10) {
    return await Workflow.find({ isArchived: false })
      .sort('-createdAt')
      .limit(limit);
  }

  /**
   * Get trending workflows (based on runCount and views descending).
   */
  async getTrendingWorkflows(limit = 10) {
    return await Workflow.find({ isArchived: false })
      .sort('-runCount -views')
      .limit(limit);
  }

  /**
   * Get recommended workflows (based on rating and views descending).
   */
  async getRecommendedWorkflows(limit = 10) {
    return await Workflow.find({ isArchived: false })
      .sort('-rating -views')
      .limit(limit);
  }

  /**
   * Get popular workflows (based on views descending).
   */
  async getPopularWorkflows(limit = 10) {
    return await Workflow.find({ isArchived: false })
      .sort('-views')
      .limit(limit);
  }

  /**
   * Get run history of a workflow.
   */
  async getWorkflowRunHistory(workflowId) {
    // Check if workflow exists
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }
    return await WorkflowRun.find({ workflowId }).sort('-createdAt');
  }

  /**
   * Archive a workflow.
   */
  async archiveWorkflow(id) {
    const workflow = await Workflow.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }
    return workflow;
  }

  /**
   * Restore an archived workflow.
   */
  async restoreWorkflow(id) {
    const workflow = await Workflow.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }
    return workflow;
  }

  /**
   * Get version history of a workflow.
   */
  async getWorkflowVersions(workflowId) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }
    return await WorkflowVersion.find({ workflowId }).sort('-version');
  }

  /**
   * Clone a workflow into a new record.
   */
  async cloneWorkflow(id) {
    const workflow = await Workflow.findOne({ _id: id, isArchived: false });
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    const clonedWorkflow = await Workflow.create({
      instruction: `${workflow.instruction} (Clone)`,
      output: workflow.output,
      topic: workflow.topic,
      difficulty: workflow.difficulty
    });

    await WorkflowVersion.create({
      workflowId: clonedWorkflow._id,
      version: 1,
      instruction: clonedWorkflow.instruction,
      output: clonedWorkflow.output,
      topic: clonedWorkflow.topic,
      difficulty: clonedWorkflow.difficulty,
      changeType: 'create'
    });

    return clonedWorkflow;
  }

  /**
   * Trigger a workflow run (simulates runs, logs, metrics).
   */
  async triggerWorkflowRun(id) {
    const workflow = await Workflow.findOne({ _id: id, isArchived: false });
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    // Determine status (85% completed, 15% failed)
    const isSuccess = Math.random() > 0.15;
    const status = isSuccess ? 'completed' : 'failed';

    const logs = [
      `[${new Date().toISOString()}] INFO  Initializing workflow runner for workflow: ${workflow._id}`,
      `[${new Date().toISOString()}] INFO  Setting up container environment (Node.js/Docker)...`,
      `[${new Date().toISOString()}] INFO  Topic: ${workflow.topic} | Difficulty: ${workflow.difficulty}`,
      `[${new Date().toISOString()}] INFO  Checking configuration validation...`,
      `[${new Date().toISOString()}] DEBUG Parsing instruction: "${workflow.instruction.substring(0, 50)}..."`
    ];

    if (isSuccess) {
      logs.push(
        `[${new Date().toISOString()}] INFO  Compilation successful. Starting test execution...`,
        `[${new Date().toISOString()}] PASS  Unit Tests successful. Code quality matches all criteria.`,
        `[${new Date().toISOString()}] INFO  Deploying build artifact to repository...`,
        `[${new Date().toISOString()}] SUCCESS Workflow finished successfully.`
      );
    } else {
      logs.push(
        `[${new Date().toISOString()}] INFO  Compilation failed. Linter returned errors in config file.`,
        `[${new Date().toISOString()}] ERROR Test run halted due to syntax exceptions.`,
        `[${new Date().toISOString()}] FATAL Workflow run execution terminated with code 1.`
      );
    }

    // Metrics simulation
    const durationMs = Math.floor(Math.random() * 8000) + 1200; // 1.2 to 9.2 seconds
    const cpuUsagePercent = Math.floor(Math.random() * 60) + 10; // 10% to 70%
    const memoryUsageMb = Math.floor(Math.random() * 512) + 128; // 128MB to 640MB

    const run = await WorkflowRun.create({
      workflowId: workflow._id,
      status,
      logs,
      metrics: {
        durationMs,
        cpuUsagePercent,
        memoryUsageMb
      }
    });

    // Update workflow stats
    workflow.runCount += 1;
    workflow.views += Math.floor(Math.random() * 3) + 1; // Increment views slightly too
    await workflow.save();

    return run;
  }

  /**
   * Cancel the latest active run for a workflow.
   */
  async cancelWorkflowRun(id) {
    const workflow = await Workflow.findOne({ _id: id, isArchived: false });
    if (!workflow) {
      const error = new Error('Workflow not found');
      error.statusCode = 404;
      throw error;
    }

    // Find the latest run that is currently "running" (or create a run and immediately cancel it)
    let latestRun = await WorkflowRun.findOne({ workflowId: id }).sort('-createdAt');
    
    if (!latestRun || latestRun.status !== 'running') {
      // Create a simulated running run first so we can cancel it
      latestRun = await WorkflowRun.create({
        workflowId: id,
        status: 'running',
        logs: [
          `[${new Date().toISOString()}] INFO  Initializing workflow runner...`,
          `[${new Date().toISOString()}] INFO  Workflow started, awaiting worker assignment...`
        ],
        metrics: { durationMs: 0, cpuUsagePercent: 5, memoryUsageMb: 128 }
      });
    }

    latestRun.status = 'cancelled';
    latestRun.logs.push(`[${new Date().toISOString()}] WARN  Cancellation signal received from user.`);
    latestRun.logs.push(`[${new Date().toISOString()}] FATAL Execution aborted.`);
    await latestRun.save();

    return latestRun;
  }

  /**
   * Get logs for the latest run of a workflow.
   */
  async getLatestRunLogs(workflowId) {
    const run = await WorkflowRun.findOne({ workflowId }).sort('-createdAt');
    if (!run) {
      const error = new Error('No run execution logs found for this workflow');
      error.statusCode = 404;
      throw error;
    }
    return {
      runId: run._id,
      status: run.status,
      logs: run.logs,
      createdAt: run.createdAt
    };
  }

  /**
   * Get metrics for the latest run of a workflow.
   */
  async getLatestRunMetrics(workflowId) {
    const run = await WorkflowRun.findOne({ workflowId }).sort('-createdAt');
    if (!run) {
      const error = new Error('No run execution metrics found for this workflow');
      error.statusCode = 404;
      throw error;
    }
    return {
      runId: run._id,
      status: run.status,
      metrics: run.metrics,
      createdAt: run.createdAt
    };
  }
}

module.exports = new WorkflowService();
