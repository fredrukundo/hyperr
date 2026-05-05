# 🧠 STEP 1 — What BitTorrent actually is (core mental model)

Before code, you need this picture:

A file is split into PIECES

You don’t download the file directly.

You download PIECES from different users (peers).


# 📦 Example


Movie.mp4 = 100 MB


Split into:

Piece 1 = 1 MB
Piece 2 = 1 MB
Piece 3 = 1 MB
...
Piece 100


# 🌍 Where pieces come from

Instead of a server:

Peer A has pieces 1–40
Peer B has pieces 30–80
Peer C has pieces 70–100


# 🧠 STEP 2 — What is a PEER?

A normal computer running torrent software

It exposes:

IP address
Port
ability to send file pieces

# 🧩 Simple definition


peer = {
    ip: "192.168.1.10",
    port: 6881
}

# 🧠 STEP 3 — What YOU actually connect to

You do NOT connect to a file.

You connect to a peer via:

TCP socket

# In Node.js:

const net = require('net');

This is your first real building block.

# ⚡ Important concept (VERY IMPORTANT)

BitTorrent is NOT HTTP.

It is:

Custom binary protocol over TCP

So:

❌ no REST API
❌ no JSON
❌ no normal requests

👉 everything is binary messages

# 🧠 STEP 4 — First real action we will build next

We will start with:

👉 Connecting to a peer


That means:

Open TCP connection → keep socket alive

# 🔧 Tiny preview code (DO NOT copy yet)

Just understand:

const net = require('net');

const socket = net.connect(6881, "1.2.3.4");


# 🧪 What this gives you

If it works, you now have:

You ↔ Peer (live connection)

No file yet. No torrent yet.

Just connection.

# 🧠 STEP 2 — BitTorrent Handshake (the real start of communication)

Now we move from “we have a connection” → to “we are officially talking BitTorrent”.

# ⚡ What is a handshake?

When you connect to a peer, you must first send a handshake message.

It’s like:

“Hi, I want this torrent. Here is its ID.”

# 🧩 Why it exists

Because one peer can be connected to many torrents.

So the handshake tells:

Which file (torrent) I want

That identifier is called:

# 👉 infoHash

# 🧠 Concept of infoHash

Think of it like:

Torrent ID = fingerprint of the file

same movie → same infoHash
different movie → different infoHash

# 📦 Handshake structure (IMPORTANT)

A BitTorrent handshake is ALWAYS:

[ length ][ protocol ][ reserved ][ infoHash ][ peerId ]

# Breakdown:

1. Protocol string      -> "BitTorrent protocol"
2. Reserved (8 bytes)   -> 00000000 00000000
3. infoHash (20 bytes)  -> 👉 identifies torrent
4. peerId (20 bytes)    -> 👉 your identity


[1 byte]  protocol length
[19 bytes] protocol string ("BitTorrent protocol")
[8 bytes]  reserved
[20 bytes] info hash
[20 bytes] peer ID

1 + 19 + 8 + 20 + 20 = 68 bytes

49 + 19 = 68

# 👉 So 49 is everything except the protocol string itself


# writeUInt8(value, offset)

Meaning of each part:

| Part  | Meaning                        |
| ----- | ------------------------------ |
| write | put data into buffer           |
| U     | unsigned (no negative numbers) |
| Int   | integer                        |
| 8     | 8 bits = 1 byte                |


writeUInt8 = write a 1-byte unsigned integer

buffer.writeUInt8(19, 0);

# Memory becomes:

index:  0   1   2   3 ...
value:  13  00  00  00 ...

Wait — why 13?

# Actually 19 in decimal is:

19 (decimal) = 13 (hex)

# So byte 0 becomes:

0x13

# Now:

buffer.write(protocol, 1);

starts filling from index 1:

index:  0   1   2   3   4   5 ...
value: [19][ B ][ i ][ t ][ T ]...

# 1. What does buffer.fill() do?

buffer.fill(value, start, end)

# Means:

“Overwrite a region of memory in the buffer with a repeated value”

So here:

value = 0
start = 1 + protocolLength
end = 1 + protocolLength + 8

👉 You are filling a section with zero bytes

# 1. What is infoHash in BitTorrent?

Buffer.from(infoHash, 'hex')
    .copy(buffer, 1 + protocolLength + 8);

infoHash is a 20-byte SHA-1 hash
It uniquely identifies a torrent (the content being shared)

# Example (hex string):

"5d41402abc4b2a76b9719d911017c592"

# This is:

40 hex characters
represents 20 bytes of real binary data

# 2. Step 1 — Buffer.from(infoHash, 'hex')

Buffer.from(infoHash, 'hex')

Converts a hex string into raw binary bytes

# How hex decoding works

Hex format:

"5d 41 40 2a ..."

Each pair = 1 byte:

| Hex | Byte |
| --- | ---- |
| 5d  | 93   |
| 41  | 65   |
| 40  | 64   |
| 2a  | 42   |


"5d4140..." (hex string)

[93][65][64][42]... (real bytes)

# So now you have:

Buffer.from(infoHash, 'hex')

# This creates a 20-byte buffer in native memory:

infoHashBuffer = [20 bytes of binary data]

# 3. Step 2 — .copy(buffer, offset)

.copy(buffer, 1 + protocolLength + 8)

This means:

“Copy this binary data into another buffer at a specific position”

# So we start writing at:

1 + 19 + 8 = 28

buffer[28]

# 5. Memory layout before this step

[0]   → 19
[1-19] → "BitTorrent protocol"
[20-27] → 00 00 00 00 00 00 00 00 (reserved)
[28-...] → empty (infoHash not written yet)

What .copy() does internally

This is NOT a string operation.

It does:

Step 1: access raw memory pointer

source buffer (infoHashBuffer)
destination buffer (main buffer)

# 7. After copying

Memory becomes:

[19]
[ "BitTorrent protocol" ]
[ 00 00 00 00 00 00 00 00 ]
[ A3 7F 91 2C ... (20 bytes infoHash) ]

___________________________________________________________________________________________


# What is net?

net is a built-in Node.js module (Gateway to raw networking in Node.js) that gives you access to:

🔌 Low-level TCP networking (Transmission Control Protocol)

# So instead of HTTP, WebSockets, etc., you are working with:

raw connections
raw bytes
sockets

# So now net becomes an object containing functions like:

net.createServer()
net.connect()
net.Socket
event handling for connections

# What is TCP (what net is built on)?

TCP is:

    A protocol that sends data as a continuous stream of bytes between two computers

No:

messages
JSON
HTTP structure

Only:

0001010100110101...

# A. Create a server

net.createServer(socket => {
  socket.write("hello");
});

# This creates a TCP server that:

accepts raw connections
sends raw bytes














