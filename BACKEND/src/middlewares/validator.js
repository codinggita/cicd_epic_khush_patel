/**
 * Middleware to validate workflow request payloads.
 */
const validateWorkflowPayload = (req, res, next) => {
  const { instruction, output, topic, difficulty } = req.body;
  
  const missingFields = [];
  if (!instruction) missingFields.push('instruction');
  if (!output) missingFields.push('output');
  if (!topic) missingFields.push('topic');
  if (!difficulty) missingFields.push('difficulty');

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Basic difficulty value verification
  const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (!validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      error: `Invalid difficulty "${difficulty}". Must be one of: ${validDifficulties.join(', ')}`
    });
  }

  next();
};

module.exports = {
  validateWorkflowPayload
};
