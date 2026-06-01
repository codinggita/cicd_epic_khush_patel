const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    name: 'CICD_Epic API Collection',
    description: 'Postman collection for testing all 49 endpoints of the CICD_Epic Knowledge & Administration API.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    {
      key: 'base_url',
      value: 'http://localhost:5000/api/v1',
      type: 'string'
    },
    {
      key: 'token',
      value: 'your_jwt_token_here',
      type: 'string'
    },
    {
      key: 'workflow_id',
      value: '6a1d3e3b0715ea060538da26',
      type: 'string'
    },
    {
      key: 'user_id',
      value: '6a1d3e3b0715ea060538da30',
      type: 'string'
    }
  ],
  item: []
};

// --- 1. AUTHENTICATION FOLDER ---
const authFolder = {
  name: '1. Authentication Operations',
  description: 'Endpoints for user sign up, login, profile retrieval, and updates.',
  item: [
    {
      name: 'User Signup',
      request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'New Developer',
            email: 'newdeveloper@cicd-epic.com',
            password: 'devpassword123',
            role: 'user'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/auth/signup',
          host: ['{{base_url}}'],
          path: ['auth', 'signup']
        }
      }
    },
    {
      name: 'User Login',
      request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            email: 'admin@cicd-epic.com',
            password: 'admin123'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/auth/login',
          host: ['{{base_url}}'],
          path: ['auth', 'login']
        }
      }
    },
    {
      name: 'Get Profile',
      request: {
        method: 'GET',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        url: {
          raw: '{{base_url}}/auth/profile',
          host: ['{{base_url}}'],
          path: ['auth', 'profile']
        }
      }
    },
    {
      name: 'Update Profile',
      request: {
        method: 'PUT',
        header: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Admin User Updated',
            email: 'admin@cicd-epic.com'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/auth/profile',
          host: ['{{base_url}}'],
          path: ['auth', 'profile']
        }
      }
    }
  ]
};
collection.item.push(authFolder);

// --- 2. WORKFLOWS CRUD & OPERATIONS FOLDER ---
const workflowFolder = {
  name: '2. Workflows CRUD & Operations',
  description: 'Manage continuous integration templates, version logging, and run executions.',
  item: [
    {
      name: 'Get All Workflows (Paginated & Searchable)',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows?page=1&limit=10&difficulty=intermediate&sort=-views&fields=instruction,topic,difficulty,views',
          host: ['{{base_url}}'],
          path: ['workflows'],
          query: [
            { key: 'page', value: '1' },
            { key: 'limit', value: '10' },
            { key: 'difficulty', value: 'intermediate' },
            { key: 'sort', value: '-views' },
            { key: 'fields', value: 'instruction,topic,difficulty,views' },
            { key: 'search', value: 'docker', disabled: true }
          ]
        }
      }
    },
    {
      name: 'Get Random Workflow',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/random',
          host: ['{{base_url}}'],
          path: ['workflows', 'random']
        }
      }
    },
    {
      name: 'Get Latest Workflows',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/latest?limit=5',
          host: ['{{base_url}}'],
          path: ['workflows', 'latest'],
          query: [{ key: 'limit', value: '5' }]
        }
      }
    },
    {
      name: 'Get Trending Workflows',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/trending?limit=5',
          host: ['{{base_url}}'],
          path: ['workflows', 'trending'],
          query: [{ key: 'limit', value: '5' }]
        }
      }
    },
    {
      name: 'Get Recommended Workflows',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/recommended?limit=5',
          host: ['{{base_url}}'],
          path: ['workflows', 'recommended'],
          query: [{ key: 'limit', value: '5' }]
        }
      }
    },
    {
      name: 'Get Popular Workflows',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/popular?limit=5',
          host: ['{{base_url}}'],
          path: ['workflows', 'popular'],
          query: [{ key: 'limit', value: '5' }]
        }
      }
    },
    {
      name: 'Get Workflow By ID',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}']
        }
      }
    },
    {
      name: 'Create Workflow',
      request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            instruction: 'Deploy production node container to AWS EKS pod',
            output: 'kubectl apply -f eks-deployment.yml\nkubectl rollout status deployment/node-app',
            topic: 'kubernetes',
            difficulty: 'advanced'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/workflows',
          host: ['{{base_url}}'],
          path: ['workflows']
        }
      }
    },
    {
      name: 'Replace Workflow (PUT)',
      request: {
        method: 'PUT',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            instruction: 'Deploy production node container to AWS EKS pod - Updated',
            output: 'kubectl apply -f eks-deployment.yml --record',
            topic: 'kubernetes',
            difficulty: 'expert'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}']
        }
      }
    },
    {
      name: 'Patch Workflow Content',
      request: {
        method: 'PATCH',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            difficulty: 'expert'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/content',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'content']
        }
      }
    },
    {
      name: 'Archive Workflow',
      request: {
        method: 'PATCH',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/archive',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'archive']
        }
      }
    },
    {
      name: 'Restore Workflow',
      request: {
        method: 'PATCH',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/restore',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'restore']
        }
      }
    },
    {
      name: 'Get Workflow Version Logs',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/versions',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'versions']
        }
      }
    },
    {
      name: 'Clone Workflow',
      request: {
        method: 'POST',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/clone',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'clone']
        }
      }
    },
    {
      name: 'Trigger Workflow Run',
      request: {
        method: 'POST',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/run',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'run']
        }
      }
    },
    {
      name: 'Get Latest Run Logs',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/logs',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'logs']
        }
      }
    },
    {
      name: 'Get Latest Run Metrics',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/metrics',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'metrics']
        }
      }
    },
    {
      name: 'Get Workflow Runs History',
      request: {
        method: 'GET',
        url: {
          raw: '{{base_url}}/workflows/history/{{workflow_id}}',
          host: ['{{base_url}}'],
          path: ['workflows', 'history', '{{workflow_id}}']
        }
      }
    },
    {
      name: 'Cancel Running Workflow',
      request: {
        method: 'POST',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}/cancel',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}', 'cancel']
        }
      }
    },
    {
      name: 'Delete Workflow (Permanent)',
      request: {
        method: 'DELETE',
        url: {
          raw: '{{base_url}}/workflows/{{workflow_id}}',
          host: ['{{base_url}}'],
          path: ['workflows', '{{workflow_id}}']
        }
      }
    }
  ]
};
collection.item.push(workflowFolder);

// --- 3. INFRASTRUCTURE GUIDES FOLDER ---
const infraTechs = [
  { name: 'Kubernetes Guides', endpoint: 'k8s' },
  { name: 'Docker Guides', endpoint: 'docker' },
  { name: 'Helm Guides', endpoint: 'helm' },
  { name: 'Terraform Guides', endpoint: 'terraform' },
  { name: 'AWS Guides', endpoint: 'aws' },
  { name: 'GCP Guides', endpoint: 'gcp' },
  { name: 'Azure Guides', endpoint: 'azure' },
  { name: 'K8s Pod Guides', endpoint: 'pods' },
  { name: 'K8s Service Guides', endpoint: 'services' },
  { name: 'K8s Deployment Guides', endpoint: 'deployments' },
  { name: 'K8s Ingress Guides', endpoint: 'ingress' },
  { name: 'K8s ConfigMap Guides', endpoint: 'configmaps' },
  { name: 'K8s Secret Guides', endpoint: 'secrets' },
  { name: 'K8s Volume Guides', endpoint: 'volumes' },
  { name: 'Networking Guides', endpoint: 'networking' },
  { name: 'Autoscaling Guides', endpoint: 'autoscaling' },
  { name: 'Security Guides', endpoint: 'security' },
  { name: 'Monitoring Guides', endpoint: 'monitoring' },
  { name: 'Logging Guides', endpoint: 'logging' },
  { name: 'Templates Guides', endpoint: 'templates' }
];

const infraFolder = {
  name: '3. Kubernetes & Infrastructure',
  description: 'Retrieve categorized guides filtered by technology or keywords, supporting full query logic.',
  item: infraTechs.map(t => ({
    name: t.name,
    request: {
      method: 'GET',
      url: {
        raw: `{{base_url}}/infra/${t.endpoint}?page=1&limit=5`,
        host: ['{{base_url}}'],
        path: ['infra', t.endpoint],
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '5' }
        ]
      }
    }
  }))
};
collection.item.push(infraFolder);

// --- 4. ADMIN USER CRUD FOLDER ---
const userFolder = {
  name: '4. Admin User Administration',
  description: 'Perform CRUD administration operations on users. Protected (Admin Role Required).',
  item: [
    {
      name: 'List Users',
      request: {
        method: 'GET',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        url: {
          raw: '{{base_url}}/users?page=1&limit=10',
          host: ['{{base_url}}'],
          path: ['users'],
          query: [
            { key: 'page', value: '1' },
            { key: 'limit', value: '10' }
          ]
        }
      }
    },
    {
      name: 'Create User',
      request: {
        method: 'POST',
        header: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Jane Admin',
            email: 'jane.admin@cicd-epic.com',
            password: 'password123',
            role: 'admin'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/users',
          host: ['{{base_url}}'],
          path: ['users']
        }
      }
    },
    {
      name: 'Get User By ID',
      request: {
        method: 'GET',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        url: {
          raw: '{{base_url}}/users/{{user_id}}',
          host: ['{{base_url}}'],
          path: ['users', '{{user_id}}']
        }
      }
    },
    {
      name: 'Update User Details',
      request: {
        method: 'PUT',
        header: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Jane Admin Promoted',
            role: 'admin'
          }, null, 2)
        },
        url: {
          raw: '{{base_url}}/users/{{user_id}}',
          host: ['{{base_url}}'],
          path: ['users', '{{user_id}}']
        }
      }
    },
    {
      name: 'Delete User Account',
      request: {
        method: 'DELETE',
        header: [
          { key: 'Authorization', value: 'Bearer {{token}}' }
        ],
        url: {
          raw: '{{base_url}}/users/{{user_id}}',
          host: ['{{base_url}}'],
          path: ['users', '{{user_id}}']
        }
      }
    }
  ]
};
collection.item.push(userFolder);

// Write to postman_collection.json
const outputPath = path.join(__dirname, '../postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log(`Successfully generated Postman Collection at: ${outputPath}`);
