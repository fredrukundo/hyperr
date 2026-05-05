# 🔐 Auth API — /token

📌 Endpoint

POST oauth/token

{
  "client": "string",   // username OR email
  "secret": "string"    // password
}


{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com"
  }
}

❌ Error Responses

1. Missing fields (400)

{
  "error": {
    "code": "MISSING_FIELDS",
    "fields": ["client", "secret"]
  }
}


👉 Frontend:

Show validation errors
Highlight missing inputs

2. Invalid credentials (401)

{
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}

👉 Frontend:

Show: "Incorrect email/username or password"


