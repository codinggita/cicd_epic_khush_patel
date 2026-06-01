const { applyQuery } = require('../utils/queryHelper');
const Workflow = require('../models/workflow');

/**
 * Controller to handle all Kubernetes & Infrastructure Guides endpoints.
 */
class InfraController {
  /**
   * Helper method to query guides using a specific Mongoose filter and the request query parameters.
   */
  async getGuides(req, res, next, filter) {
    try {
      // Ensure archived workflows are excluded from infrastructure guides by default
      const baseFilter = { ...filter, isArchived: false };
      const result = await applyQuery(Workflow, req.query, baseFilter);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/infra/k8s
  getK8sGuides(req, res, next) {
    return this.getGuides(req, res, next, { topic: { $in: ['kubernetes', 'kubernetes_official'] } });
  }

  // GET /api/v1/infra/docker
  getDockerGuides(req, res, next) {
    return this.getGuides(req, res, next, { topic: { $in: ['docker', 'docker_official'] } });
  }

  // GET /api/v1/infra/helm
  getHelmGuides(req, res, next) {
    return this.getGuides(req, res, next, { topic: 'helm' });
  }

  // GET /api/v1/infra/terraform
  getTerraformGuides(req, res, next) {
    return this.getGuides(req, res, next, { topic: { $in: ['terraform', 'terraform_official'] } });
  }

  // GET /api/v1/infra/aws
  getAwsGuides(req, res, next) {
    const regex = /aws/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/gcp
  getGcpGuides(req, res, next) {
    const regex = /gcp/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/azure
  getAzureGuides(req, res, next) {
    const regex = /azure/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/pods
  getPodGuides(req, res, next) {
    const regex = /pod/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/services
  getServiceGuides(req, res, next) {
    const regex = /service/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/deployments
  getDeploymentGuides(req, res, next) {
    const regex = /deployment/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/ingress
  getIngressGuides(req, res, next) {
    const regex = /ingress/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/configmaps
  getConfigMapGuides(req, res, next) {
    const regex = /configmap/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/secrets
  getSecretGuides(req, res, next) {
    const regex = /secret/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/volumes
  getVolumeGuides(req, res, next) {
    const regex = /volume/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/networking
  getNetworkingGuides(req, res, next) {
    const regex = /network/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/autoscaling
  getAutoscalingGuides(req, res, next) {
    const regex = /autoscaling|scale/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/security
  getSecurityGuides(req, res, next) {
    const regex = /security/i;
    return this.getGuides(req, res, next, {
      $or: [{ topic: 'security' }, { instruction: regex }, { output: regex }]
    });
  }

  // GET /api/v1/infra/monitoring
  getMonitoringGuides(req, res, next) {
    const regex = /monitoring/i;
    return this.getGuides(req, res, next, {
      $or: [{ topic: 'monitoring' }, { instruction: regex }, { output: regex }]
    });
  }

  // GET /api/v1/infra/logging
  getLoggingGuides(req, res, next) {
    const regex = /logging|log\b/i; // Matches log or logging word
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }

  // GET /api/v1/infra/templates
  getTemplatesGuides(req, res, next) {
    const regex = /template|starter workflow/i;
    return this.getGuides(req, res, next, {
      $or: [{ instruction: regex }, { output: regex }, { topic: regex }]
    });
  }
}

module.exports = new InfraController();
