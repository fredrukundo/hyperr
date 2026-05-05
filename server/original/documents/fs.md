# 🧠 PART 1 — What is fs (File System)?

In Node.js, the file system (fs) module lets your server talk to files on your disk.

Think of it like:

Your code  ⇄  fs  ⇄  Hard Drive (files)

# 🔹 Import fs

const fs = require('fs');

# 🔹 Basic operations (just to warm up)

Before streams, understand the file.

const stat = fs.statSync('video.mp4');
console.log(stat);

# 🧠 stat is ALSO an object

console.log(typeof stat); // object
console.log(Object.keys(stat));

# 🔥 IMPORTANT ATTRIBUTES

stat.size        // file size in bytes
stat.isFile()    // true if file
stat.isDirectory()
stat.birthtime   // created date
stat.mtime       // modified date

# 🧪 FULL DEBUG

console.log("Size:", stat.size);
console.log("Is file:", stat.isFile());
console.log("Created:", stat.birthtime);

# 🚀 PART 2 — createReadStream (MAIN OBJECT)

const stream = fs.createReadStream('video.mp4');

🔥 stream is an OBJECT

Specifically:

👉 Readable Stream

# 🔥 MOST IMPORTANT METHODS OF STREAM

1️⃣ .on(event, callback)

👉 Listen to events

🔹 Example

stream.on('data', (chunk) => {});

# 🔥 EVENTS YOU MUST KNOW

🟢 data

stream.on('data', (chunk) => {
    console.log("Chunk received");
});

👉 Fired when chunk is ready

stream.on('end', () => {
    console.log("Finished");
});


# 2️⃣ .pipe(destination)

stream.pipe(res);

👉 Automatically sends data

🧠 Internally:

data → write → end

# 3️⃣ .pause() / .resume()

stream.pause();
stream.resume();

👉 Control flow manually

# 4️⃣ .read()

# 👉 Pull data manually (advanced)

const chunk = stream.read();

# 5️⃣ .destroy()

stream.destroy();

👉 Stop stream immediately










