
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * Create Apollo GraphQL Server
 */
function createGraphQLServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Extract user from JWT token
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;
      
      if (token) {
        try {
          // Verify token and extract user
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = decoded;
        } catch (error) {
          // Invalid token
        }
      }

      return { user, req };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: error.path,
      };
    },
    playground: process.env.NODE_ENV !== 'production',
    introspection: process.env.NODE_ENV !== 'production',
  });
}

module.exports = { createGraphQLServer };
