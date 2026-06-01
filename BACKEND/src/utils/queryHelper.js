/**
 * Helper function to apply filtering, sorting, projection, search, and pagination to a Mongoose query.
 * @param {mongoose.Model} Model - The Mongoose Model to query.
 * @param {Object} reqQuery - The Express request query parameters (req.query).
 * @param {Object} extraFilters - Any hardcoded filters to merge (e.g. isArchived: false).
 * @returns {Promise<Object>} - Paginated query response metadata and results.
 */
const applyQuery = async (Model, reqQuery, extraFilters = {}) => {
  // 1. Copy query parameters
  const queryObj = { ...reqQuery };

  // 2. Exclude control fields from standard key-value matching
  const excludeFields = ['page', 'limit', 'sort', 'search', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  // 3. Initialize filters
  let filter = { ...queryObj, ...extraFilters };

  // Handle case-insensitive regex search for 'search' param across instruction & output
  if (reqQuery.search) {
    const searchRegex = { $regex: reqQuery.search, $options: 'i' };
    filter.$or = [
      { instruction: searchRegex },
      { output: searchRegex },
      { topic: searchRegex }
    ];
  }

  // 4. Create base query
  let query = Model.find(filter);

  // 5. Select Fields (Projection)
  if (reqQuery.fields) {
    const fields = reqQuery.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // 6. Sorting
  if (reqQuery.sort) {
    const sortBy = reqQuery.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sort by createdAt descending, falling back to ID
    query = query.sort('-createdAt _id');
  }

  // 7. Pagination
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  query = query.skip(startIndex).limit(limit);

  // 8. Execute queries concurrently
  const [results, total] = await Promise.all([
    query.exec(),
    Model.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    count: results.length,
    pagination: {
      page,
      limit,
      totalPages,
      total,
      hasPrevious: page > 1,
      hasNext: page < totalPages
    },
    data: results
  };
};

module.exports = {
  applyQuery
};
