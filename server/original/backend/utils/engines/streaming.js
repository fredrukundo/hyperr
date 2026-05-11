const e = require('express');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
const trackers = require('../../utils/trackers');
const pump = require('pump');
const os = require('os');
const { PassThrough } = require('stream');
const { pipeline } = require('stream/promises');
const { resolve } = require('dns');
const delay = (ms) => new Promise(r => setTimeout(r, ms));


var engines = {};
const VIDEO_EXTENSIONS = [
    '.mp4', '.mkv', '.webm', '.mov', '.avi', '.wmv',
    '.flv', '.m4v', '.3gp', '.mpg', '.mpeg', '.ogv', '.ogg',
]

function getRange(req, fileSize) {
    const range = req.headers.range;
    if (!range) {
        return null;
    }
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    return { start, end, chunkSize };
}

async function initEngine(req, res, movie) {
    if (engines[movie.torrent_link]) {
        return engines[movie.torrent_link];
    }
    const response = await fetch(movie.torrent_link);
    if (!response.ok) {
        throw new Error(`Failed to fetch torrent`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let options = {
        path: `./uploads/movies/`,
        trackers: trackers,
        dht: true,
        tracker: true
    }
    const engine = torrentStream(buffer, options);
    engine.isReady = false;
    engine.on('ready', () => {
        engine.isReady = true;
        engines[movie.torrent_link] = engine;
        console.log(`[torrent] engine ready — ${engine.files.length} files`);
    });
    engine.on('idle', () => {
        const streamFile = findStreamFile(engine);
        const moviePath = `./uploads/movies/${movie.identifier}/${streamFile.file.name}`;
        if (streamFile.found &&
            fs.existsSync(moviePath) &&
            streamFile.file.length === fs.statSync(moviePath).size) {
            engine.movieDownloaded = true;
            engine.moviePath = moviePath;
        }
    });
    engine.on('error', (err) => {
        console.log("Engine error:", err);
        engine.destroy(() => { });
        delete engines[movie.torrent_link];
    });
    engine.on('download', (index) => {
        console.log(`[torrent] piece ${index} downloaded, total: ${(engine.swarm.downloaded / 1024 / 1024).toFixed(1)} MB`);
    });
    engine.on('peer', () => {
        console.log(`[torrent] peers: ${engine.swarm.wires.length}`);
    });
    return engine;
}

function findStreamFile(engine) {
    if (!engine.isReady) {
        throw new Error('Engine is not ready');
    }
    const files = engine.torrent.files;
    if (!files || files.length === 0) {
        throw new Error('No files found in torrent');
    }

    let targetIndex = -1;
    let targetFile = null;
    let maxSize = -1;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = path.extname(file.name).toLowerCase();

        if (VIDEO_EXTENSIONS.includes(fileExtension)) {
            if (fileExtension === '.mp4' || fileExtension === '.webm') {
                targetIndex = i;
                targetFile = file;
                break; // Prefer mp4/webm, stop searching
            }
            // if (file.length > maxSize) {
            //     maxSize = file.length;
            //     targetIndex = i;
            //     targetFile = file;
            // }
        }
    }
    if (!targetFile) {
        return { found: false, index: -1, file: null, needConvert: false, mimeType: null };
    }
    const fileExtension = path.extname(targetFile.name).toLowerCase();
    const needConvert = !(fileExtension === '.mp4' || fileExtension === '.webm');
    const mimeType = needConvert ? 'video/webm' : (fileExtension === '.mp4' ? 'video/mp4' : 'video/webm');
    return { found: true, index: targetIndex, file: targetFile, needConvert, mimeType };
}

function awaitEngineReady(engine, timeoutMs) {
    return new Promise((resolve, reject) => {
        const onReady = () => {
            cleanup();
            resolve();
        };
        const onError = (err) => {
            cleanup();
            reject(err);
        };
        const onTimeout = () => {
            cleanup();
            reject(new Error('ENGINE_READY_TIMEOUT'));
        };

        const cleanup = () => {
            clearTimeout(timer);
            engine.off('ready', onReady);
            engine.off('error', onError);
        };

        engine.once('ready', onReady);
        engine.once('error', onError);

        const timer = setTimeout(onTimeout, timeoutMs);
    });
}

function convertAndStream(res, targetFile, moviePath) {
    res.writeHead(200, {
        "Content-Type": "video/webm",
        "Transfer-Encoding": "chunked"
    });
    // const { stream: inputStream, stop } = streamFromDisk(moviePath, 0, targetFile.length - 1);
    const inputStream = targetFile.createReadStream();
    let command = ffmpeg(inputStream)
        .audioBitrate(128)
        .audioCodec("libvorbis")
        .audioChannels(2)
        .videoBitrate(1024)
        .videoCodec("libvpx")
        .outputFormat("webm")
        .outputOptions([
            "-cpu-used 2",
            "-deadline realtime",
            "-preset ultrafast",
            "-error-resilient 1",
            `-threads ${Math.min(os.availableParallelism(), 16)}`,
        ]);

    command
        .on("error", (err, _stdout, stderr) => {
            console.error("FFmpeg stderr: " + stderr);
        })
        .on("end", () => {
            console.log("\nConversion finished successfully!");
        });
    res.on('close', () => {
        console.log("Client disconnected, stopping conversion");
        stop();
        command.kill('SIGKILL');
    });
    command.pipe(res, { end: true });
}

async function waitForFileToGrow(filePath) {
    const start = Date.now();
    const minBytes = 1 << 20 // 1MB;
    const maxWaitTime = 60000; // 60 seconds

    while (Date.now() - start < maxWaitTime) {
        try {
            const stat = await fs.promises.stat(filePath);
            if (stat.size >= minBytes)
                return stat.size;
        } catch {
            // file doesn't exist yet
        }
        await new Promise(r => setTimeout(r, 250));
    }

    throw new Error('FILE_NOT_READY');
}

function streamFromDisk(filePath, start, end) {
    const out = new PassThrough();
    let offset = start;
    let stopped = false;
    let currentChunk = null;
    const pollMs = 250;

    const stop = () => {
        if (stopped) return;
        stopped = true;
        if (currentChunk) currentChunk.destroy();
        if (!out.destroyed) out.end();
    };

    (async () => {
        while (!stopped && offset <= end) {
            let size;
            try {
                size = (await fs.promises.stat(filePath)).size;
            } catch {
                await delay(pollMs);
                continue;
            }

            // Wait until we have at least 1 byte available at `offset`
            if (size <= offset) {
                await delay(pollMs);
                continue;
            }

            const chunkEnd = Math.min(size - 1, end);
            currentChunk = fs.createReadStream(filePath, { start: offset, end: chunkEnd });
            try {
                await pipeline(currentChunk, out, { end: false });
            } finally {
                currentChunk = null;
            }

            offset = chunkEnd + 1;
        }

        if (!out.destroyed) out.end();
    })().catch(err => out.destroy(err));

    return { stream: out, stop };
}

function sendStream(statusCode, res, inputStream, mimeType, fileSize) {
    res.writeHead(statusCode, {
        "Content-Length": fileSize,
        "Content-Type": mimeType,
        "Accept-Ranges": "bytes"
    });
    inputStream.pipe(res);
}

async function pipeStream(req, res, movie) {
    const engine = await initEngine(req, res, movie);
    if (!engine.isReady) {
        await awaitEngineReady(engine, 20000);
    }
    if (engine.movieDownloaded) {
        const moviePath = engine.moviePath;
        const fileSize = fs.statSync(moviePath).size;
        const range = getRange(req, fileSize);
        console.log(`Movie already downloaded, streaming from disk. Range: ${range || 'none'}`);
        engine.disconnect(() => { });
        engine.destroy(() => { });
        delete engines[movie.torrent_link];
        if (range) {
            res.writeHead(206, {
                "Accept-Ranges": "bytes",
                "Content-Range": `bytes ${range.start}-${range.end}/${fileSize}`,
                "Content-Length": range.chunkSize,
                "Content-Type": "video/mp4"
            });
            const inoutStream = fs.createReadStream(moviePath, { start: range.start, end: range.end });
            inoutStream.pipe(res);
            return;
        } else {
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
                "Accept-Ranges": "bytes"
            });
            const inoutStream = fs.createReadStream(moviePath);
            inoutStream.pipe(res);
        }
        return;
    }
    const { found, index, file, needConvert, mimeType } = findStreamFile(engine);
    if (!found) {
        throw new Error('NO_STREAM_FILE_FOUND');
    }

    const targetFile = engine.files[index];
    const fileSize = file.length;
    const rangeParams = getRange(req, fileSize);
    targetFile.select();
    let moviePath = `./uploads/movies/${movie.identifier}/${targetFile.name}`;
    //await waitForFileToGrow(moviePath);
    movie.downloaded_path = moviePath;
    if (needConvert) {
        convertAndStream(res, targetFile, moviePath);
    } else {
        // If the client sent a Range header but it's invalid/unsupported, return 416.
        if (req.headers.range && !rangeParams) {
            res.writeHead(416, {
                "Content-Range": `bytes */${fileSize}`,
                "Accept-Ranges": "bytes"
            });
            return res.end();
        }
        const inputStream = rangeParams ? targetFile.createReadStream({ start: rangeParams.start, end: rangeParams.end }) : targetFile.createReadStream();
        const stopStream = () => {
            inputStream.destroy();
        };
        if (!rangeParams) {
            // const { stream: inputStream, stop } = streamFromDisk(moviePath, 0, fileSize - 1);
            res.on('close', stopStream);
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": mimeType,
                "Accept-Ranges": "bytes"
            });
            inputStream.pipe(res);
        } else {
            // const { stream: inputStream, stop } = streamFromDisk(moviePath, start, end);
            res.on('close', () => {
                stopStream();
            });
            res.writeHead(206, {
                "Accept-Ranges": "bytes",
                "Content-Range": "bytes " + rangeParams.start + "-" + rangeParams.end + "/" + fileSize,
                "Content-Length": rangeParams.chunkSize,
                "Content-Type": mimeType
            });
            inputStream.pipe(res);
        }

    }
}

module.exports = {
    pipeStream
};