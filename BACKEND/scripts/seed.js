const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Workflow = require('../src/models/workflow');
const WorkflowVersion = require('../src/models/workflowVersion');
const WorkflowRun = require('../src/models/workflowRun');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cicd-epic-db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      Workflow.deleteMany({}),
      WorkflowVersion.deleteMany({}),
      WorkflowRun.deleteMany({})
    ]);
    console.log('Database cleared.');

    const datasetPath = path.join(__dirname, '../cicd-epic.json');
    console.log(`Reading dataset from: ${datasetPath}`);
    const rawData = fs.readFileSync(datasetPath, 'utf8');
    const rawWorkflows = JSON.parse(rawData);

    console.log(`Loaded ${rawWorkflows.length} raw workflow records. Formatting data...`);

    const formattedWorkflows = rawWorkflows.map((item) => {
      // Pre-generate scattered creation dates in the last 30 days
      const daysAgo = Math.random() * 30;
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      // Pre-generate views, runs, and ratings
      const views = Math.floor(Math.random() * 950) + 50; // 50 to 1000 views
      const runCount = Math.floor(Math.random() * (views * 0.4)) + 5; // run count proportional to views (up to 40%)
      const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // Rating between 3.5 and 5.0 (rounded to 1 decimal place)

      return {
        instruction: item.instruction,
        output: item.output,
        topic: item.topic || 'general',
        difficulty: item.difficulty || 'beginner',
        views,
        runCount,
        rating,
        isArchived: false,
        createdAt,
        updatedAt: createdAt
      };
    });

    console.log('Inserting workflows into MongoDB...');
    const insertedWorkflows = await Workflow.insertMany(formattedWorkflows);
    console.log(`Successfully inserted ${insertedWorkflows.length} workflows.`);

    console.log('Creating initial version history logs...');
    const versionHistory = insertedWorkflows.map((w) => ({
      workflowId: w._id,
      version: 1,
      instruction: w.instruction,
      output: w.output,
      topic: w.topic,
      difficulty: w.difficulty,
      changeType: 'create',
      changedAt: w.createdAt
    }));

    await WorkflowVersion.insertMany(versionHistory);
    console.log('Successfully created initial version history logs.');

    console.log('Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDB();
