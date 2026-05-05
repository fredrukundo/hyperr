const cron = require('node-cron');
const fs = require('fs');
const pool = require('../../config/pool');

cron.schedule('0 3 * * *', async () => {
    try {
        //console.log("🧹 Running movie cleanup...");

        // 1. Find expired movies
        const result = await pool.query(`
            SELECT id, downloaded_path 
            FROM movies 
            WHERE last_watched < NOW() - INTERVAL '30 days'
        `);

        // 2. Delete files from disk
        for (const movie of result.rows) {
            if (movie.downloaded_path && fs.existsSync(movie.downloaded_path)) {
                fs.unlinkSync(movie.downloaded_path);
                //console.log("🗑 Deleted file:", movie.downloaded_path);
            }
        }

        // 3. Delete DB records
        await pool.query(`
            DELETE FROM movies 
            WHERE last_watched < NOW() - INTERVAL '30 days'
        `);

        //console.log(`✅ Cleaned ${result.rowCount} movies`);

    } catch (err) {
        //console.log("❌ Cleanup error:", err.message);
    }
});



