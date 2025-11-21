const { Pool } = require('pg');

let pool;

async function initializeDb() {
    try {
        if (!pool) {
            pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                },
                // 🚀 PERFORMANCE OPTIMIZATION: Enhanced Connection Pooling
                max: 30,                    // Max connections (up from default 10)
                min: 10,                    // Min idle connections
                idleTimeoutMillis: 30000,   // Close idle connections after 30s
                connectionTimeoutMillis: 5000,
                application_name: 'mynet-backend',
                maxUses: 7500,              // Recycle connections to prevent memory leaks
                statement_timeout: 30000    // 30s query timeout
            });

            await pool.query('SELECT NOW()'); 
            console.log('✅ DATABASE: Connection Pool created and connected successfully to Neon PostgreSQL.');
            console.log(`   Max connections: 30 | Min connections: 10`);
        }
        return true;
    } catch (error) {
        console.error('❌ DATABASE ERROR: Failed to connect to Neon PostgreSQL.');
        console.error('Error Details:', error.message);
        return false;
    }
}

function getPool() {
    if (!pool) {
        throw new Error("Database Pool not initialized. Call initializeDb() first.");
    }
    return pool;
}

module.exports = {
    initializeDb,
    getPool
};
