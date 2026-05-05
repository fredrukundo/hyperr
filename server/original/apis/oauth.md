# 🔐 Authentication API Documentation

# 1 . 42
# 2 . GitHub
# 3 . Discord

use (.env) inside /backend , note that the 42 and github are working keys which are below

JWT_SECRET=RANDOM_JWT_TOKEN
EXPRESS_PORT=8000
INFO_MODE=true
DEBUG_MODE=true
FORTYTWO_CLIENT_ID=u-s4t2ud-e806e6bd934de81875669a4cd6cc9ea38a0303650acef407ec397a1422a2a80f
FORTYTWO_CLIENT_SECRET=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
GITHUB_CLIENT_ID=Ov23liCKpexgecXZiS7C
GITHUB_CLIENT_SECRET=b1c77005a4cc216199b3df40e941fcff19c538e9
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=


Base URL:

http://127.0.0.1:7002/auth


All authentication is handled via OAuth2 providers. The flow is always:

Frontend redirects user → backend /auth/{provider}
Provider authenticates user
Provider redirects back → backend /auth/{provider}/callback
Backend returns JWT + user info (JSON response)


🌐 General Response Format (Callback)

After successful login, the backend returns:

{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "username": "ayman",
    "email": "ayman@example.com"
  }
}

# 🔑 1. 42 Authentication

Frontend should simply redirect user:

🚀 Start Login

GET /auth/42

📌 Description

Redirects user to 42 OAuth login page.

🔁 Flow

Frontend should simply redirect user:

window.location.href = "http://127.0.0.1:7002/auth/42";

# 🔙 Callback

GET /auth/42/callback


📌 Description

Called automatically by 42 after login.

📤 Response

Returns JSON with JWT + user info.

# 2 . GitHub

- the same configurations of 42

# 3 . Discord

- the same configurations of 42


