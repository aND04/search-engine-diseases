const mariadb = require('mariadb');

const pool = mariadb.createPool({
    // host: localhost,
    host: 'appserver.alunos.di.fc.ul.pt',
    user: 'aw002',
    password: 'aw002',
    database: 'aw002'
});
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
