const TABLE_NAME = process.env.TABLE_NAME;

const connectAndQuery = async (db, query) => {
    let result;

    try {
        const client = await db.connect();
        result = await client.query(query);
        client.release();
    } catch (err) {
        result = err;
    }

    return result;
}

const getData = async (req, res, db) => {
    try {
        const client = await db.connect();
        const result = await client.query(`SELECT * FROM ${process.env.TABLE_NAME}`);

        res.send(result.rows);
    } catch(err) {
        res.send(err);
    }
}

const postData = async (req, res, db) => {
    const {id, date, distance, time} = req.body;
    const query = `INSERT INTO ${TABLE_NAME} VALUES (${id}, ${date}, ${distance}, ${time})`;

    await connectAndQuery(db, query)
        .then(results => res.send(results));
}

const putData = async (req, res, db) => {
    const { id, date, distance, time } = req.body;
    const query = `UPDATE ${TABLE_NAME} SET data=${date}, distance=${distance}, time=${time} WHERE id=${id}`;

    await connectAndQuery(db, query)
        .then(results => res.send(results));
}

const deleteData = async (req, res, db) => {
    const { id } = req.body
    const query = `DELETE FROM ${TABLE_NAME} where ID = ${id}`;

    await connectAndQuery(db, query)
        .then(results => res.send(results));
}

module.exports = {
    getData,
    putData,
    postData,
    deleteData
};
