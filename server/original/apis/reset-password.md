# 🔐 Password Reset API Documentation

Flow consists of 3 steps:

Request reset token
Confirm token
Change password

🔁 Full Flow (Frontend Logic)

note: no email service to use right now i store the token in the db 

in case you want to check the token:

    1. enter postgress container like :

        docker exec -it database bash

    2. access the db in the terminal of the container:

        psql -U hypertube -w
    
    3. check availables tables with (optional):

        \dt

    4. check the table of the users and check the token in the password_reset_requests table:

        select * from users;
        select * from password_reset_requests;


Step-by-step:

User enters email/username
    → call security/reset-password/request

User clicks link from email
    → extract token
    → call security/reset-password/confirm

If valid:
    → show reset form

User submits new password
    → call security/reset-password/change


# 1️⃣ Request Password Reset

POST security/reset-password/request

📥 Body

{
  "email_username": "string"
}

✅ Success Response (ALWAYS same for security)

{
  "message": "IF_EMAIL_USERNAME_EXISTS_RESET_SENT"
}

⚠️ i Always returns success even if user does not exist (prevents user enumeration)

❌ Errors

Missing input

{
  "error": { "code": "MISSING_EMAIL" }
}

Too many requests (max 3 per hour)

{
  "error": { "code": "RESET_LIMIT_REACHED" }
}

🧠 Frontend Notes

Accepts email OR username

Always show:

👉 “If the account exists, a reset link has been sent”

Handle rate limit (429)

# 2️⃣ Confirm Reset Token

GET security/reset-password/confirm?token=...

📥 Query Params

token=string


✅ Success

{
  "message": "ALLOW_ACCESS"
}


❌ Errors

Missing token

{
  "error": { "code": "MISSING_FIELDS" }
}


Invalid or expired token (1 hour validity)

{
  "error": { "code": "EXPIRED_SESSION" }
}


🧠 Frontend Notes

Call this when user opens reset link

If success → show reset password form
If error → redirect to "expired link" page

# 3️⃣ Change Password

POST security/reset-password/change

{
  "token": "string",
  "new_password": "string",
  "re_password": "string"
}

✅ Success

{
  "message": "PASSWORD_RESET_SUCCESS"
}

❌ Errors

Missing fields


{
  "error": { "code": "MISSING_FIELDS" }
}

Token expired or invalid

{
  "error": { "code": "EXPIRED_SESSION" }
}


Weak password (< 6 chars)

{
  "error": { "code": "WEAK_PASSWORD" }
}


Passwords do not match

{
  "error": { "code": "PASSWORD_NOT_MATCH" }
}


User not found (edge case)

{
  "error": { "code": "INVALID_USER" }
}


🧠 Frontend Notes

Validate before sending:

password length ≥ 6
passwords match

On success:

👉 redirect to login page
👉 show “Password successfully reset”














