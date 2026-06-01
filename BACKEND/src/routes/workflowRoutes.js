const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { validateWorkflowPayload } = require('../middlewares/validator');

// 1. Static and Analytics routes first (to prevent Express from matching :id)
router.get('/random', (req, res, next) => workflowController.getRandomWorkflow(req, res, next));
router.get('/latest', (req, res, next) => workflowController.getLatestWorkflows(req, res, next));
router.get('/trending', (req, res, next) => workflowController.getTrendingWorkflows(req, res, next));
router.get('/recommended', (req, res, next) => workflowController.getRecommendedWorkflows(req, res, next));
router.get('/popular', (req, res, next) => workflowController.getPopularWorkflows(req, res, next));

// 2. Prefix-specific dynamic routes
router.get('/history/:id', (req, res, next) => workflowController.getWorkflowRunHistory(req, res, next));

// 3. Collection routes (GET all and POST create)
router.get('/', (req, res, next) => workflowController.getWorkflows(req, res, next));
router.post('/', validateWorkflowPayload, (req, res, next) => workflowController.createWorkflow(req, res, next));

// 4. Document-specific detail and update routes
router.get('/:id', (req, res, next) => workflowController.getWorkflowById(req, res, next));
router.put('/:id', validateWorkflowPayload, (req, res, next) => workflowController.replaceWorkflow(req, res, next));
router.delete('/:id', (req, res, next) => workflowController.deleteWorkflow(req, res, next));

// 5. Operation-specific PATCH, sub-resource, versioning, and run routes
router.patch('/:id/content', (req, res, next) => workflowController.patchWorkflowContent(req, res, next));
router.patch('/:id/archive', (req, res, next) => workflowController.archiveWorkflow(req, res, next));
router.patch('/:id/restore', (req, res, next) => workflowController.restoreWorkflow(req, res, next));
router.get('/:id/versions', (req, res, next) => workflowController.getWorkflowVersions(req, res, next));
router.post('/:id/clone', (req, res, next) => workflowController.cloneWorkflow(req, res, next));
router.get('/:id/logs', (req, res, next) => workflowController.getWorkflowLogs(req, res, next));
router.get('/:id/metrics', (req, res, next) => workflowController.getWorkflowMetrics(req, res, next));
router.post('/:id/run', (req, res, next) => workflowController.triggerWorkflowRun(req, res, next));
router.post('/:id/cancel', (req, res, next) => workflowController.cancelWorkflowRun(req, res, next));

module.exports = router;
