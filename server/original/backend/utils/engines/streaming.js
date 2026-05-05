const fs = require('fs');
const path = require('path');
const pool = require('../../config/pool');

let client = null;
const torrents = new Map();

/* =========================
   INIT TORRENT CLIENT
========================= */
const initClient = async () => {
    if (client) return client;

    const WebTorrent = (await import('webtorrent')).default;

    client = new WebTorrent({
        path: path.resolve('./movies')
    });

    return client;
};

/* =========================
   GET VIDEO FILE
========================= */
const getVideoFile = (torrent) => {
    return torrent.files.find(f =>
        f.name.endsWith('.mp4') || f.name.endsWith('.mkv')
    );
};

/* =========================
   CREATE / GET TORRENT
========================= */
const getOrCreateTorrent = async (magnet, movie) => {
    if (torrents.has(magnet)) {
        return torrents.get(magnet);
    }

    const client = await initClient();

    const torrent = await new Promise((resolve) => {
        client.add(magnet, (t) => resolve(t));
    });

    torrents.set(magnet, torrent);

    // ✅ Download ONLY (no streaming)
    const file = getVideoFile(torrent);
    if (file) file.select();

    torrent.on('done', async () => {
        try {
            const file = getVideoFile(torrent);
            if (!file) return;

            const filePath = path.join(torrent.path, file.path);

            if (fs.existsSync(filePath)) {
                await pool.query(
                    'UPDATE movies SET downloaded_path = $1, status = $2 WHERE id = $3',
                    [filePath, 'downloaded', movie.id]
                );
            }

            console.log("✅ Fully downloaded:", torrent.name);
        } catch (err) {
            console.log("Torrent done update error:", err.message);
        }
    });

    return torrent;
};

/* =========================
   USER HISTORY
========================= */
const upsertUserHistory = async (userId, movieId, progress = 0) => {
    try {
        await pool.query(`
            UPDATE movies SET last_watched = CURRENT_TIMESTAMP WHERE id = $1
        `, [movieId]);

        await pool.query(`
            INSERT INTO user_movie_history (user_id, movie_id, progress)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, movie_id)
            DO UPDATE SET 
                progress = EXCLUDED.progress,
                last_watched = CURRENT_TIMESTAMP
        `, [userId, movieId, progress]);

    } catch (err) {
        console.log("History DB error:", err.message);
    }
};

/* =========================
   WAIT UNTIL FILE EXISTS
========================= */
const waitForFile = (filePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            if (fs.existsSync(filePath)) {
                return resolve();
            }

            if (Date.now() - start > timeout) {
                return reject(new Error("File not created yet"));
            }

            setTimeout(check, 300);
        };

        check();
    });
};

/* =========================
   STREAM FROM DISK (PROGRESSIVE)
========================= */
const streamFromDiskProgressive = (filePath, req, res) => {
    const range = req.headers.range;

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // ❌ No range → basic streaming
    if (!range) {
        res.writeHead(200, {
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize,
        });

        const stream = fs.createReadStream(filePath);

        req.on('close', () => stream.destroy());

        return stream.pipe(res);
    }

    // ✅ Parse range
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // ⚠️ Clamp to downloaded size
    const safeEnd = Math.min(end, fileSize - 1);

    if (start >= fileSize) {
        return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = (safeEnd - start) + 1;

    const stream = fs.createReadStream(filePath, {
        start,
        end: safeEnd
    });

    res.writeHead(206, {
        'Content-Range': `bytes ${start}-${safeEnd}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    });

    req.on('close', () => stream.destroy());

    stream.on('error', (err) => {
        console.log("Stream error:", err.message);
        if (!res.headersSent) res.status(500).end();
    });

    stream.pipe(res);
};

/* =========================
   MAIN CONTROLLER
========================= */
const Streaming = async (magnet, req, res, movie) => {
    const userId = req.user?.id;

    try {
        const torrent = await getOrCreateTorrent(magnet, movie);

        const file = getVideoFile(torrent);

        if (!file) {
            return res.status(404).send('No video file found');
        }

        const filePath = path.join(torrent.path, file.path);

        // ⏳ Wait until file appears
        try {
            await waitForFile(filePath, 8000);
        } catch {
            return res.status(202).json({
                message: "Initializing download...",
            });
        }

        // 🎬 Stream while downloading
        if (userId) {
            await upsertUserHistory(userId, movie.id, 0.1);
        }

        return streamFromDiskProgressive(filePath, req, res);

    } catch (err) {
        console.error("❌ Global error:", err);

        if (!res.headersSent) {
            res.status(500).send('Streaming error');
        }
    }
};

module.exports = Streaming;

/*
sudo apt update
sudo apt install transmission-daemon -y

service transmission-daemon start

apt update && apt install qbittorrent-nox -y

qbittorrent-nox
*/