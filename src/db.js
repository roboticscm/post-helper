const { Pool } = require('pg');

export const pool = new Pool({
    host: process.env.DB_SERVER || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'posthelper',
    password: process.env.DB_PASSWORD || 'posthelper',
    database: process.env.DB_NAME || 'posthelper',
    max: 20
});

module.exports = pool;