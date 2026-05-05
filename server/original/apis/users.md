👤 Users API Documentation

# All endpoints require authentication (except users/register):

Authorization: Bearer <token>

# 1️⃣ Register User

POST /users/register

📥 Body

{
  "username": "string",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "password": "string",
  "repassword": "string"
}

✅ Success

{
  "success": { "code": "REGISTER_SUCCESSED" }
}


❌ Errors

Missing fields

{
  "error": {
    "code": "MISSING_FIELDS",
    "fields": ["username", "email"]
  }
}


Invalid email

{
  "error": { "code": "INVALID_EMAIL" }
}


Email already exists

{
  "error": { "code": "EMAIL_ALREADY_EXISTS" }
}

Username already exists

{
  "error": { "code": "USERNAME_ALREADY_EXISTS" }
}

Invalid username format

{
  "error": { "code": "INVALID_USERNAME" }
}


👉 Rules:

only lowercase letters + dots
min 3 characters
no .., no starting/ending with .

Password mismatch

{
  "error": { "code": "PASSWORD_NOT_MATCH" }
}


Weak password (< 6 chars)

{
  "error": { "code": "WEAK_PASSWORD" }
}


General error

{
  "error": { "code": "GENERAL_ERROR" }
}


🧠 Frontend Notes

Convert:

email → lowercase
username → lowercase
Validate before sending (avoid unnecessary API calls)
Show specific error per field


# 2️⃣ Get All Users (Basic List)

GET /users

✅ Success

{
  "success": {
    "data": [
      {
        "id": 1,
        "username": "john"
      }
    ]
  }
}


❌ Errors

{
  "error": { "code": "GENERAL_ERROR" }
}


🧠 Frontend Notes
    Lightweight endpoint (id + username only)
Use for:
    mentions
    search dropdowns

# 3️⃣ Get User Profile

GET /users/:id

✅ Success

If requesting own profile

{
  "username": "john",
  "email": "john@email.com",
  "profile_picture": "...",
  "first_name": "John",
  "last_name": "Doe",
  "preferred_language": "en"
}

If requesting other user

{
  "username": "john",
  "profile_picture": "...",
  "first_name": "John",
  "last_name": "Doe"
}

❌ Errors

User not found

{
  "error": { "code": "USER_NOT_FOUND" }
}

General error

{
  "error": { "code": "GENERAL_ERROR" }
}


# 4️⃣ Update User Profile

PATCH /users/:id

🔐 Authorization Rule

User can only update their own account

📥 Content-Type

multipart/form-data => profile_picture : <file>

📥 Body (all optional)

| Field              | Type   |
| ------------------ | ------ |
| email              | string |
| username           | string |
| first_name         | string |
| last_name          | string |
| preferred_language | string |
| profile_picture    | file   |

✅ Success

{
  "success": { "code": "ACCOUNT_UPDATED" }
}


❌ Errors

No fields provided

{
  "error": { "code": "NO_FIELDS_TO_UPDATE" }
}

Forbidden (not your account)

{
  "error": { "code": "FORBIDDEN_OPERATION" }
}

Field-specific Errors

Email
    
    INVALID_EMAIL
    EMAIL_TOO_LONG
    EMAIL_ALREADY_EXISTS

Username

INVALID_USERNAME
USERNAME_ALREADY_EXISTS

Names

{
  "error": { "code": "INVALID_FIRST_NAME_LENGTH" }
}

{
  "error": { "code": "INVALID_LAST_NAME_LENGTH" }
}


Language

{
  "error": { "code": "UNSUPPORTED_LANGUAGE" }
}


[BACKEND-SUPPORT]    

    const languages = {
        en: "English",
        fr: "French",
        ar: "Arabic"
    };

🧠 Frontend Notes

🔁 Partial Update

Only send fields you want to update

Example:

{
  first_name: "NewName"
}


🖼️ Profile Picture Upload

const formData = new FormData();
formData.append("profile_picture", file);


🌍 Language Handling
Must match backend languages config
Example values:

en, fr, ar ...












