# 🧩 PART 1 — Big Picture (What you’re building)

When a user clicks “Watch movie”:

Frontend → Backend → Torrent → Download Pieces → Stream Video

# 🔁 Real Flow:

User sends request:

GET /stream?magnet=...

Server:

checks if movie exists locally
if NOT → starts torrent
downloads small pieces

As soon as enough pieces are ready:

server starts streaming video

# 🔥 Key Concept (VERY IMPORTANT)

👉 Torrent does NOT download full file first
👉 It downloads pieces (chunks)

Movie = 1GB
Split into = 1000 pieces
Each piece = 1MB

# So:

After ~5MB downloaded → you can start streaming first seconds

# 🧩 PART 2 — Non-Blocking (Your Requirement)

You said:

"Any treatment must be done in background in a non-blocking manner"

# ❌ Blocking (BAD)

const data = fs.readFileSync('movie.mp4'); // blocks everything

# ✅ Non-blocking (GOOD)

fs.createReadStream('movie.mp4');


# What is a Buffer?

A Buffer is a temporary storage area in memory that holds raw binary data.

# The Problem Buffers Solve

JavaScript was designed for text (UTF-16 strings), not binary data. Buffers bridge this gap.

# What Type of Data Does a Buffer Store?

Buffers store raw binary data (bytes) - numbers from 0 to 255 (8-bit unsigned integers).

// Each position in a buffer holds a number 0-255

const buffer = Buffer.from([65, 66, 67, 68]);
console.log(buffer); // <Buffer 41 42 43 44>
console.log(buffer.toString()); // "ABCD" (65='A', 66='B', etc.)

# Data Types Buffers Can Store
________________________________________________________________________________

Data Type	        Example	        How Buffer Stores It
________________________________________________________________________________

Text	            "Hello"	        ASCII/UTF-8 bytes: [72, 101, 108, 108, 111]
Numbers	            255	            Single byte: [255]
Images	            PNG/JPG	        Pixel data as bytes
Videos	            MP4	Encoded     video frames
Audio	            MP3	Sound       wave samples
Files	            PDF/DOCX	    Raw file bytes
Network packets	    TCP/UDP	        Protocol data

________________________________________________________________________________


