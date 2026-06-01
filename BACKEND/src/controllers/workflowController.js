const workflowService = require('../services/workflowService');

/**
 * Controller to handle all CI/CD workflows API endpoints.
 */
class WorkflowController {
  // GET /api/v1/workflows
  async getWorkflows(req, res, next) {
    try {
      const result = await workflowService.getWorkflows(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/:id
  async getWorkflowById(req, res, next) {
    try {
      const workflow = await workflowService.getWorkflowById(req.params.id);
      res.status(200).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/workflows
  async createWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.createWorkflow(req.body);
      res.status(201).json({ success: true, message: 'Workflow created successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/workflows/:id
  async replaceWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.replaceWorkflow(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Workflow replaced successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/workflows/:id/content
  async patchWorkflowContent(req, res, next) {
    try {
      const workflow = await workflowService.patchWorkflowContent(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Workflow content updated successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/workflows/:id
  async deleteWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.deleteWorkflow(req.params.id);
      res.status(200).json({ success: true, message: 'Workflow deleted successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/random
  async getRandomWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.getRandomWorkflow();
      res.status(200).json({ success: true, data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/latest
  async getLatestWorkflows(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const workflows = await workflowService.getLatestWorkflows(limit);
      res.status(200).json({ success: true, count: workflows.length, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/trending
  async getTrendingWorkflows(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const workflows = await workflowService.getTrendingWorkflows(limit);
      res.status(200).json({ success: true, count: workflows.length, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/recommended
  async getRecommendedWorkflows(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const workflows = await workflowService.getRecommendedWorkflows(limit);
      res.status(200).json({ success: true, count: workflows.length, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/popular
  async getPopularWorkflows(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const workflows = await workflowService.getPopularWorkflows(limit);
      res.status(200).json({ success: true, count: workflows.length, data: workflows });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/history/:id
  async getWorkflowRunHistory(req, res, next) {
    try {
      const history = await workflowService.getWorkflowRunHistory(req.params.id);
      res.status(200).json({ success: true, count: history.length, data: history });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/workflows/:id/archive
  async archiveWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.archiveWorkflow(req.params.id);
      res.status(200).json({ success: true, message: 'Workflow archived successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/workflows/:id/restore
  async restoreWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.restoreWorkflow(req.params.id);
      res.status(200).json({ success: true, message: 'Workflow restored successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/:id/versions
  async getWorkflowVersions(req, res, next) {
    try {
      const versions = await workflowService.getWorkflowVersions(req.params.id);
      res.status(200).json({ success: true, count: versions.length, data: versions });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/workflows/:id/clone
  async cloneWorkflow(req, res, next) {
    try {
      const workflow = await workflowService.cloneWorkflow(req.params.id);
      res.status(201).json({ success: true, message: 'Workflow cloned successfully', data: workflow });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/:id/logs
  async getWorkflowLogs(req, res, next) {
    try {
      const logs = await workflowService.getLatestRunLogs(req.params.id);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/workflows/:id/metrics
  async getWorkflowMetrics(req, res, next) {
    try {
      const metrics = await workflowService.getLatestRunMetrics(req.params.id);
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/workflows/:id/run
  async triggerWorkflowRun(req, res, next) {
    try {
      const run = await workflowService.triggerWorkflowRun(req.params.id);
      res.status(200).json({ success: true, message: 'Workflow run triggered successfully', data: run });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/workflows/:id/cancel
  async cancelWorkflowRun(req, res, next) {
    try {
      const run = await workflowService.cancelWorkflowRun(req.params.id);
      res.status(200).json({ success: true, message: 'Workflow run cancelled successfully', data: run });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkflowController();
