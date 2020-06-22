const defaultData = require('./assets/default-data.json');
const testData = require('./assets/data.json');
const TABLE_NAME = process.env.TABLE_NAME;

/**
 * Determine whether we should return the result or an error
 * @param result
 * @returns {*}
 */
const resultOrError = result => {
    return result.result ? result.result : result.error;
}

/**
 * Connect to the database and make the query with optional values
 * @param db
 * @param query
 * @param values
 * @returns {Promise<*>}
 */
const connectAndQuery = async (db, query, values) => {
    let result = {result: null, error: null};

    try {
        const client = await db.connect();
        result.result = await client.query(query, values);
        client.release();
    } catch (err) {
        result.error = err;
    }

    return resultOrError(result);
}

/**
 * GET
 * @param req
 * @param res
 * @param db
 * @returns {Promise<void>}
 */
const getData = async (req, res, db) => {
    const query = `SELECT * FROM ${TABLE_NAME}`;

    const result = await connectAndQuery(db, query);
    res.send(result.rows);
};

/**
 * POST - Create
 * @param req
 * @param res
 * @param db
 * @returns {Promise<void>}
 */
const postData = async (req, res, db) => {
    const {date, distance, minutes, seconds} = req.body;
    const query = `INSERT INTO ${TABLE_NAME} (date, distance, minutes, seconds) VALUES ($1, $2, $3, $4) RETURNING *`;

    const result = await connectAndQuery(db, query, [date, distance, minutes, seconds]);
    res.send(result.rows);
};

/**
 * PUT - Update
 * @param req
 * @param res
 * @param db
 * @returns {Promise<void>}
 */
const putData = async (req, res, db) => {
    const { id, date, distance, minutes, seconds } = req.body;
    const query = `UPDATE ${TABLE_NAME} SET date=$1, distance=$2, minutes=$3, seconds=$4 WHERE id=$5 RETURNING *`;

    const result = await connectAndQuery(db, query, [date, distance, minutes, seconds, id]);
    res.send(result.rows);
};

/**
 * DELETE
 * @param req
 * @param res
 * @param db
 * @returns {Promise<void>}
 */
const deleteData = async (req, res, db) => {
    const { id } = req.body;
    const query = `DELETE FROM ${TABLE_NAME} where ID = $1 RETURNING *`;

    const result = await connectAndQuery(db, query, [id]);
    res.send(result.rows);
};

/**
 * Reset the database with default data
 * @param req
 * @param res
 * @param db
 * @param type
 * @returns {Promise<void>}
 */
const resetDb = async (req, res, db, type) => {
    const drop = `DROP TABLE ${TABLE_NAME};`;
    const create = `CREATE TABLE ${TABLE_NAME} (id SERIAL, date text, distance numeric(4,2), minutes integer, seconds integer);`;

    const data = (type === 'test') ? testData : defaultData;

    try {
        const client = await db.connect();
        client.query(drop)
            .then(client.query(create))
            .then(() => {
                data.forEach(data => {
                    const insert = `INSERT INTO ${TABLE_NAME} (date, distance, minutes, seconds) VALUES ($1, $2, $3, $4)`;
                    const values = [data.date, data.distance, data.minutes, data.seconds];
                    client.query(insert, values)
                })
            });
        res.send('Database reset successfully');
        client.release();
    } catch (err) {
        res.send(err);
    }
}

module.exports = {
    getData,
    putData,
    postData,
    deleteData,
    resetDb
};
