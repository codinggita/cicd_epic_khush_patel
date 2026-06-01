const express = require('express');
const router = express.Router();
const infraController = require('../controllers/infraController');

// Define infrastructure routes
router.get('/k8s', (req, res, next) => infraController.getK8sGuides(req, res, next));
router.get('/docker', (req, res, next) => infraController.getDockerGuides(req, res, next));
router.get('/helm', (req, res, next) => infraController.getHelmGuides(req, res, next));
router.get('/terraform', (req, res, next) => infraController.getTerraformGuides(req, res, next));
router.get('/aws', (req, res, next) => infraController.getAwsGuides(req, res, next));
router.get('/gcp', (req, res, next) => infraController.getGcpGuides(req, res, next));
router.get('/azure', (req, res, next) => infraController.getAzureGuides(req, res, next));
router.get('/pods', (req, res, next) => infraController.getPodGuides(req, res, next));
router.get('/services', (req, res, next) => infraController.getServiceGuides(req, res, next));
router.get('/deployments', (req, res, next) => infraController.getDeploymentGuides(req, res, next));
router.get('/ingress', (req, res, next) => infraController.getIngressGuides(req, res, next));
router.get('/configmaps', (req, res, next) => infraController.getConfigMapGuides(req, res, next));
router.get('/secrets', (req, res, next) => infraController.getSecretGuides(req, res, next));
router.get('/volumes', (req, res, next) => infraController.getVolumeGuides(req, res, next));
router.get('/networking', (req, res, next) => infraController.getNetworkingGuides(req, res, next));
router.get('/autoscaling', (req, res, next) => infraController.getAutoscalingGuides(req, res, next));
router.get('/security', (req, res, next) => infraController.getSecurityGuides(req, res, next));
router.get('/monitoring', (req, res, next) => infraController.getMonitoringGuides(req, res, next));
router.get('/logging', (req, res, next) => infraController.getLoggingGuides(req, res, next));
router.get('/templates', (req, res, next) => infraController.getTemplatesGuides(req, res, next));

module.exports = router;
