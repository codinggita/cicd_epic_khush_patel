const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');

const PORT = 5001;
let server;

// Helper to make native HTTP requests to localhost:5001
const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsedBody;
        try {
          parsedBody = data ? JSON.parse(data) : null;
        } catch (e) {
          parsedBody = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsedBody
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(postData);
    }
    req.end();
  });
};

// Global Test Runner
const runTests = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cicd-epic-db');
    console.log('MongoDB connected.');

    // 2. Start HTTP server
    server = app.listen(PORT, async () => {
      console.log(`Test server listening on port ${PORT}\n`);
      
      try {
        await executeTestCases();
      } catch (err) {
        console.error('Test Execution Error:', err);
      } finally {
        console.log('\nClosing test server and database connection...');
        server.close(() => {
          mongoose.connection.close();
          console.log('Server and DB connection closed.');
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Setup Error:', error);
    process.exit(1);
  }
};

// Test Suite
const executeTestCases = async () => {
  console.log('==================================================');
  console.log('               STARTING API VERIFICATION          ');
  console.log('==================================================');

  let testWorkflowId;

  // Test Case 1: Health Check Endpoint
  const healthRes = await request('GET', '/health');
  assert(healthRes.statusCode === 200, 'Health check should return 200');
  assert(healthRes.body.status === 'healthy', 'Health check should be healthy');
  logSuccess('Health Check Endpoint');

  // Test Case 2: Get Workflows (Default pagination)
  const getWorkflowsRes = await request('GET', '/api/v1/workflows');
  assert(getWorkflowsRes.statusCode === 200, 'GET /workflows should return 200');
  assert(getWorkflowsRes.body.success === true, 'Response success should be true');
  assert(getWorkflowsRes.body.data.length === 10, 'Should return default 10 items per page');
  assert(getWorkflowsRes.body.pagination.total >= 2708, 'Total database count should match seeded size');
  logSuccess('GET /workflows (Default Pagination & Count)');

  // Test Case 3: Filtering, Sorting, Searching, and Projection
  const queryRes = await request('GET', '/api/v1/workflows?limit=5&difficulty=intermediate&sort=views&fields=instruction,views');
  assert(queryRes.statusCode === 200, 'Advanced query should return 200');
  assert(queryRes.body.count === 5, 'Should limit output to 5 items');
  assert(queryRes.body.data[0].instruction !== undefined, 'Should project instruction field');
  assert(queryRes.body.data[0].difficulty === undefined, 'Should exclude non-projected fields');
  // Check sorting (views in ascending order, if view1 <= view2)
  const view1 = queryRes.body.data[0].views;
  const view2 = queryRes.body.data[1].views;
  assert(view1 <= view2, 'Should sort by views ascending');
  logSuccess('GET /workflows (Pagination, Filtering, Sorting, & Projection)');

  // Test Case 4: Regex Search
  const searchRes = await request('GET', '/api/v1/workflows?search=kubernetes&limit=2');
  assert(searchRes.statusCode === 200, 'Search query should return 200');
  assert(searchRes.body.data.length > 0, 'Should return matching search guides');
  logSuccess('GET /workflows (Regex Phrase Search)');

  // Test Case 5: Get Special Static Analytics Endpoints
  const randomRes = await request('GET', '/api/v1/workflows/random');
  assert(randomRes.statusCode === 200, 'GET /workflows/random should return 200');
  assert(randomRes.body.data !== null, 'Should return a single random workflow object');
  logSuccess('GET /workflows/random');

  const latestRes = await request('GET', '/api/v1/workflows/latest?limit=3');
  assert(latestRes.statusCode === 200, 'GET /latest should return 200');
  assert(latestRes.body.data.length === 3, 'Should fetch latest 3 items');
  logSuccess('GET /workflows/latest');

  const trendingRes = await request('GET', '/api/v1/workflows/trending?limit=2');
  assert(trendingRes.statusCode === 200, 'GET /trending should return 200');
  assert(trendingRes.body.data[0].runCount >= trendingRes.body.data[1].runCount, 'Trending should sort by runCount desc');
  logSuccess('GET /workflows/trending');

  const popularRes = await request('GET', '/api/v1/workflows/popular?limit=2');
  assert(popularRes.statusCode === 200, 'GET /popular should return 200');
  assert(popularRes.body.data[0].views >= popularRes.body.data[1].views, 'Popular should sort by views desc');
  logSuccess('GET /workflows/popular');

  const recommendedRes = await request('GET', '/api/v1/workflows/recommended?limit=2');
  assert(recommendedRes.statusCode === 200, 'GET /recommended should return 200');
  assert(recommendedRes.body.data[0].rating >= recommendedRes.body.data[1].rating, 'Recommended should sort by rating desc');
  logSuccess('GET /workflows/recommended');

  // Test Case 6: Create Workflow (POST)
  const newWorkflow = {
    instruction: 'Setup automated deployment for Kubernetes cluster using Ansible',
    output: 'ansible-playbook -i inventory.ini deploy-k8s.yml',
    topic: 'ansible',
    difficulty: 'advanced'
  };
  const createRes = await request('POST', '/api/v1/workflows', newWorkflow);
  assert(createRes.statusCode === 201, 'POST should return 201');
  assert(createRes.body.success === true, 'Create response success should be true');
  assert(createRes.body.data.instruction === newWorkflow.instruction, 'Workflow instruction should match');
  testWorkflowId = createRes.body.data._id;
  logSuccess('POST /workflows (Create Workflow)');

  // Test Case 7: Validation check
  const badWorkflow = { instruction: 'Invalid workflow payload' };
  const failCreateRes = await request('POST', '/api/v1/workflows', badWorkflow);
  assert(failCreateRes.statusCode === 400, 'Should return 400 Bad Request');
  assert(failCreateRes.body.success === false, 'Success should be false on validation error');
  logSuccess('POST /workflows (Payload Validation Middleware Check)');

  // Test Case 8: Fetch single workflow (GET /:id) & View Incrementor
  const fetchResBefore = await request('GET', `/api/v1/workflows/${testWorkflowId}`);
  assert(fetchResBefore.statusCode === 200, 'GET /:id should return 200');
  assert(fetchResBefore.body.data.views === 1, 'Initial view count should be incremented to 1');
  
  const fetchResAfter = await request('GET', `/api/v1/workflows/${testWorkflowId}`);
  assert(fetchResAfter.body.data.views === 2, 'Subsequent view count should be incremented to 2');
  logSuccess('GET /workflows/:id (Detail & View Auto-Increment)');

  // Test Case 9: Replace Workflow (PUT) & Version History Logging
  const updatedWorkflow = {
    instruction: 'Setup automated deployment for Kubernetes cluster using Ansible - V2',
    output: 'ansible-playbook -i inventory.ini deploy-k8s.yml --verbose',
    topic: 'ansible',
    difficulty: 'advanced'
  };
  const putRes = await request('PUT', `/api/v1/workflows/${testWorkflowId}`, updatedWorkflow);
  assert(putRes.statusCode === 200, 'PUT /:id should return 200');
  assert(putRes.body.data.instruction === updatedWorkflow.instruction, 'Instruction should be replaced');
  logSuccess('PUT /workflows/:id (Replace Workflow)');

  // Test Case 10: Partial Content Update (PATCH)
  const patchRes = await request('PATCH', `/api/v1/workflows/${testWorkflowId}/content`, {
    output: 'ansible-playbook deploy.yml'
  });
  assert(patchRes.statusCode === 200, 'PATCH /:id/content should return 200');
  assert(patchRes.body.data.output === 'ansible-playbook deploy.yml', 'Output should be partially updated');
  assert(patchRes.body.data.instruction === updatedWorkflow.instruction, 'Instruction should remain unchanged');
  logSuccess('PATCH /workflows/:id/content (Partial Update)');

  // Test Case 11: Verify Version History (/versions)
  const versionsRes = await request('GET', `/api/v1/workflows/${testWorkflowId}/versions`);
  assert(versionsRes.statusCode === 200, 'GET /:id/versions should return 200');
  assert(versionsRes.body.count === 3, 'Should have 3 version records (create, replace, patch)');
  assert(versionsRes.body.data[0].version === 3, 'Latest version should be version 3');
  assert(versionsRes.body.data[2].version === 1, 'First version should be version 1');
  logSuccess('GET /workflows/:id/versions (Version Auditing Check)');

  // Test Case 12: Clone Workflow (/clone)
  const cloneRes = await request('POST', `/api/v1/workflows/${testWorkflowId}/clone`);
  assert(cloneRes.statusCode === 201, 'POST /:id/clone should return 201');
  assert(cloneRes.body.data.instruction.includes('(Clone)'), 'Cloned instruction should include "(Clone)" indicator');
  const cloneId = cloneRes.body.data._id;
  logSuccess('POST /workflows/:id/clone (Cloning Check)');

  // Test Case 13: Trigger Workflow Run (/run)
  const runRes = await request('POST', `/api/v1/workflows/${testWorkflowId}/run`);
  assert(runRes.statusCode === 200, 'POST /:id/run should return 200');
  assert(runRes.body.data.status !== 'running', 'Simulated run should finish and have final status');
  assert(runRes.body.data.logs.length > 0, 'Run logs should be generated');
  assert(runRes.body.data.metrics.durationMs > 0, 'Run duration metric should be simulated');
  logSuccess('POST /workflows/:id/run (Simulated Runner Setup)');

  // Test Case 14: Get Latest Logs & Metrics
  const logsRes = await request('GET', `/api/v1/workflows/${testWorkflowId}/logs`);
  assert(logsRes.statusCode === 200, 'GET /:id/logs should return 200');
  assert(logsRes.body.data.logs.length > 0, 'Should return execution logs array');
  
  const metricsRes = await request('GET', `/api/v1/workflows/${testWorkflowId}/metrics`);
  assert(metricsRes.statusCode === 200, 'GET /:id/metrics should return 200');
  assert(metricsRes.body.data.metrics.cpuUsagePercent > 0, 'Should return simulated CPU usage stats');
  logSuccess('GET /workflows/:id/logs & /metrics');

  // Test Case 15: Run History
  const historyRes = await request('GET', `/api/v1/workflows/history/${testWorkflowId}`);
  assert(historyRes.statusCode === 200, 'GET /workflows/history/:id should return 200');
  assert(historyRes.body.count === 1, 'Should return 1 execution run history record');
  logSuccess('GET /workflows/history/:id (Runs Auditing Check)');

  // Test Case 16: Cancel running workflow
  const cancelRes = await request('POST', `/api/v1/workflows/${testWorkflowId}/cancel`);
  assert(cancelRes.statusCode === 200, 'POST /:id/cancel should return 200');
  assert(cancelRes.body.data.status === 'cancelled', 'Run status should be updated to cancelled');
  logSuccess('POST /workflows/:id/cancel');

  // Test Case 17: Archive (Soft Delete) Workflow
  const archiveRes = await request('PATCH', `/api/v1/workflows/${testWorkflowId}/archive`);
  assert(archiveRes.statusCode === 200, 'PATCH /:id/archive should return 200');
  assert(archiveRes.body.data.isArchived === true, 'isArchived field should be set to true');

  // Verify archived workflows do not show up in normal GET or details fetch
  const verifyFetchRes = await request('GET', `/api/v1/workflows/${testWorkflowId}`);
  assert(verifyFetchRes.statusCode === 404, 'Fetching archived workflow details directly should fail');
  logSuccess('PATCH /workflows/:id/archive (Soft Delete / Archival Check)');

  // Test Case 18: Restore Archived Workflow
  const restoreRes = await request('PATCH', `/api/v1/workflows/${testWorkflowId}/restore`);
  assert(restoreRes.statusCode === 200, 'PATCH /:id/restore should return 200');
  assert(restoreRes.body.data.isArchived === false, 'isArchived field should be set back to false');

  const verifyRestoreFetchRes = await request('GET', `/api/v1/workflows/${testWorkflowId}`);
  assert(verifyRestoreFetchRes.statusCode === 200, 'Restored workflow details should be queryable again');
  logSuccess('PATCH /workflows/:id/restore (Restoring Archived Workflows)');

  // Test Case 19: Permanent Delete
  const deleteRes = await request('DELETE', `/api/v1/workflows/${testWorkflowId}`);
  assert(deleteRes.statusCode === 200, 'DELETE /:id should return 200');
  
  // Clean up the cloned workflow as well
  await request('DELETE', `/api/v1/workflows/${cloneId}`);
  logSuccess('DELETE /workflows/:id (Hard Deletion Cleanup)');

  // Test Case 20: Infrastructure Guides Routes (/infra/*)
  const k8sGuidesRes = await request('GET', '/api/v1/infra/k8s?limit=3');
  assert(k8sGuidesRes.statusCode === 200, '/infra/k8s should return 200');
  assert(k8sGuidesRes.body.data.length > 0, '/infra/k8s should return guides');
  assert(k8sGuidesRes.body.data[0].topic.includes('kubernetes'), 'Should match kubernetes topic guides');

  const dockerGuidesRes = await request('GET', '/api/v1/infra/docker?limit=1');
  assert(dockerGuidesRes.statusCode === 200, '/infra/docker should return 200');
  assert(dockerGuidesRes.body.data.length > 0, '/infra/docker should return guides');
  assert(dockerGuidesRes.body.data[0].topic.includes('docker'), 'Should match docker topic guides');

  const awsGuidesRes = await request('GET', '/api/v1/infra/aws?limit=1');
  assert(awsGuidesRes.statusCode === 200, '/infra/aws should return 200');
  // Confirm regex matching on instruction/output contains 'aws'
  const isAwsMatch = awsGuidesRes.body.data[0].instruction.toLowerCase().includes('aws') || 
                     awsGuidesRes.body.data[0].output.toLowerCase().includes('aws');
  assert(isAwsMatch, 'Guide should match AWS keyword in instruction or output');

  const podGuidesRes = await request('GET', '/api/v1/infra/pods?limit=1');
  assert(podGuidesRes.statusCode === 200, '/infra/pods should return 200');

  const networkingGuidesRes = await request('GET', '/api/v1/infra/networking?limit=1');
  assert(networkingGuidesRes.statusCode === 200, '/infra/networking should return 200');
  logSuccess('GET /infra/* routes (k8s, docker, aws, pods, networking verified)');

  console.log('\n==================================================');
  console.log('     CONGRATULATIONS: ALL TESTS PASSED SUCCESSFULLY!    ');
  console.log('==================================================');
};

// Asset helper
const assert = (condition, errorMessage) => {
  if (!condition) {
    throw new Error(`Assertion Failed: ${errorMessage}`);
  }
};

const logSuccess = (testName) => {
  console.log(`[PASS] ${testName}`);
};

runTests();
