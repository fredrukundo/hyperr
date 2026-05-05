# 🧠 1. What multer actually is (design + purpose)

multer is a middleware factory for Express.js
It parses multipart/form-data (used for file uploads)

# 👉 Without multer:

Express cannot read files
req.body only works for JSON / urlencoded

# 👉 With multer:

It intercepts the request stream
Extracts files
Attaches them to req.file / req.files

# ⚙️ 2. Storage Engine (Disk Storage)

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

# What is diskStorage()?

A factory function
Returns a storage engine object

# Internally:

type StorageEngine = {
  _handleFile(req, file, cb)
  _removeFile(req, file, cb)
}

So diskStorage() builds an object implementing that interface.

# destination: 'uploads/'

Syntax possibilities:
String → static folder
Function → dynamic

# Internally:

destination(req, file, cb)

👉 cb(null, path)

null → no error
path → where to save

# 🔹 filename

filename: (req, file, cb) => {}

| param  | type           | description          |
| ------ | -------------- | -------------------- |
| `req`  | Request object | full Express request |
| `file` | Object         | file metadata        |
| `cb`   | Function       | callback             |


# 📦 file object structure:

{
  fieldname: 'profile_picture',
  originalname: 'photo.png',
  encoding: '7bit',
  mimetype: 'image/png',
  stream: ReadableStream
}

# 🔹 Callback pattern

cb(error, filename)

cb(null, filename) → success
cb(err) → fail upload

# 🧱 3. Multer Instance

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {}
});

# What does multer() return?

👉 It returns a middleware builder object

# 🚦 4. limits

limits: { fileSize: 2 * 1024 * 1024 }

Type: object
Unit: bytes

👉 2MB = 2097152 bytes

# Internally:

Multer listens to the file stream
If size exceeded → throws error:

LIMIT_FILE_SIZE

# 🛡️ 5. fileFilter

fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('ONLY_IMAGES_ALLOWED'));
    }
    cb(null, true);
}

(req, file, cb) => void

| Call              | Meaning           |
| ----------------- | ----------------- |
| `cb(null, true)`  | accept file       |
| `cb(null, false)` | reject silently   |
| `cb(error)`       | reject with error |

# ⚠️ Important:

file.mimetype

Comes from client headers
Can be faked

# 👉 Safer approach:

Check file extension
OR inspect file buffer (advanced)

req.file = {
  filename,
  path,
  mimetype,
  size,
  ...
}

# upload.single()

upload.single('profile_picture')

🔹 What it does:
Accepts 1 file only
Field name must match:

<input type="file" name="profile_picture" />

🔹 Return type:

👉 Returns Express middleware function
(req, res, next) => void
