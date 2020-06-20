const TABLE_NAME = process.env.TABLE_NAME;

const resultOrError = result => {
    return result.result ? result.result : result.error;
}

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

// GET
const getData = async (req, res, db) => {
    const query = `SELECT * FROM ${TABLE_NAME}`;

    const result = await connectAndQuery(db, query);
    res.send(result.rows);
};

// CREATE
const postData = async (req, res, db) => {
    const {date, distance, time} = req.body;
    const query = `INSERT INTO ${TABLE_NAME} (date, distance, time) VALUES ($1, $2, $3) RETURNING *`;

    const result = await connectAndQuery(db, query, [date, distance, time]);
    res.send(result.rows);
};

// UPDATE
const putData = async (req, res, db) => {
    const { id, date, distance, time } = req.body;
    const query = `UPDATE ${TABLE_NAME} SET date=$1, distance=$2, time=$3 WHERE id=$4 RETURNING *`;

    const result = await connectAndQuery(db, query, [date, distance, time, id]);
    res.send(result.rows);
};

// DELELTE
const deleteData = async (req, res, db) => {
    const { id } = req.body;
    const query = `DELETE FROM ${TABLE_NAME} where ID = $1 RETURNING *`;

    const result = await connectAndQuery(db, query, [id]);
    res.send(result.rows);
};

const resetDb = async(req, res, db) => {
    const drop = `DROP TABLE ${TABLE_NAME};`;
    const create = `CREATE TABLE ${TABLE_NAME} (id SERIAL, date text, distance numeric(4,2), time numeric(5,2));`;
    const insert = `INSERT INTO ${TABLE_NAME}(date, distance, time) VALUES('2020-05-01', 1.23, 1.23)`;

    try {
        const client = await db.connect();
        client.query(drop)
            .then(client.query(create))
            .then(client.query(insert));
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
