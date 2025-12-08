
require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function killExistingProcesses() {
  try {
    const { execSync } = require('child_process');
    
    console.log('🧹 Cleaning up existing processes...');
    
    // Kill all node processes on port 3000
    try {
      execSync(`lsof -ti:3000 | xargs kill -9 2>/dev/null || true`, { stdio: 'ignore' });
    } catch (e) {}
    
    try {
      execSync(`fuser -k 3000/tcp 2>/dev/null || true`, { stdio: 'ignore' });
    } catch (e) {}
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ Cleanup completed');
  } catch (e) {
    console.log('⚠️ Cleanup completed with warnings');
  }
}

async function startServer() {
  try {
    await killExistingProcesses();

    console.log('========================================');
    console.log('🚀 MyNet.tn Backend Starting...');
    console.log('========================================');

    // Bootstrap DI Container
    const { bootstrap } = require('./core/bootstrap');
    await bootstrap();
    console.log('✅ DI Container initialized');

    // Initialize database
    const { initializeDb } = require('./config/db');
    const dbInitialized = await initializeDb();

    if (!dbInitialized) {
      console.warn('⚠️ Database connection failed - running in limited mode');
    } else {
      console.log('✅ Database connected');
      
      // Check database health
      try {
        const { checkDatabaseHealth } = require('./utils/databaseHealthCheck');
        const health = await checkDatabaseHealth();
        console.log(`✅ Database health: ${health.status}`);
      } catch (healthError) {
        console.warn('⚠️ Health check skipped');
      }
    }

    // Import app
    const app = require('./app');

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Handle server errors
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is in use. Retrying...`);
        setTimeout(() => {
          killExistingProcesses().then(() => startServer());
        }, 2000);
      } else {
        console.error('❌ Server error:', error.message);
        process.exit(1);
      }
    });

    // Start listening
    httpServer.listen(PORT, HOST, () => {
      console.log('========================================');
      console.log(`✅ Backend running on http://${HOST}:${PORT}`);
      console.log(`✅ Network: http://172.31.68.98:${PORT}`);
      console.log('========================================');
      console.log('📋 Available Endpoints:');
      console.log('  • Health: GET /health');
      console.log('  • Auth: POST /api/auth/login');
      console.log('  • Tenders: GET /api/procurement/tenders');
      console.log('  • API Docs: GET /api-docs');
      console.log('========================================');
      console.log('👥 Test Accounts:');
      console.log('  • Buyer: buyer@mynet.tn / buyer123');
      console.log('  • Supplier: supplier@mynet.tn / supplier123');
      console.log('========================================');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️ SIGTERM received, shutting down...');
      httpServer.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ CRITICAL: Failed to start server');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', error.message);
    
    if (error.stack) {
      console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
}

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', String(reason));
  process.exit(1);
});

// Start
startServer();
