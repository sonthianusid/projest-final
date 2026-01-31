import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sonthishop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Execute query helper
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(sql, params);
        return rows as T[];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Execute query and return single row
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
    try {
        const pool = getPool();
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// Close all connections
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('Database pool closed');
    }
}

export default {
    getPool,
    query,
    queryOne,
    testConnection,
    closePool,
};
