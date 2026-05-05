const pool = require("../../config/pool")

const DEBUG = process.env.DEBUG_MODE || false

const movieWatched = async (id, source) => {
    try {
        const result = await pool.query(
            `SELECT * FROM user_movie_history 
             WHERE identifier = $1 AND engine = $2`,
            [id, source]
        );

        if (id === "76050") {
            console.log("yess : ", result.rows.length > 0);
        }

        return result.rows.length > 0;

    } catch (error) {
        console.log('[ERROR] -> movieWatched -> ', error.message);
        return false;
    }
};


module.exports = {movieWatched}