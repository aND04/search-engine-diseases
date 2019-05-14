const mariadb = require('mariadb');
const config = require('../../config');

const pool = mariadb.createPool(config.db);
async function connection() {
    try {
        return await pool.getConnection();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    query: async function (query, ...values) {
        const conn = await connection();
        const queryExecution = await conn.query(query, values);
        await conn.end();
        return queryExecution;
    }
};
