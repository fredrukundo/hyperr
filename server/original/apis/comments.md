# 📘 Comments API Documentation

Base URL + 🔒 Auth Required

/comments

# All endpoints require authentication:

Authorization: Bearer <token>

# 🔹 1. Get Latest Comments

GET /comments

✅ Description

Returns the latest 20 comments.

📥 Response

{
  "success": {
    "data": [
      {
        "id": 1,
        "content": "Nice movie!",
        "created_at": "2026-04-21T12:00:00.000Z",
        "username": "client1"
      }
    ]
  }
}


📌 Notes

Ordered by newest first
Limited to 20 comments

# 🔹 2. Get Comment by ID

GET /comments/:id

✅ Description

Returns a single comment by its ID.

📥 Response (Success)

{
  "success": {
    "data": {
      "id": 1,
      "content": "Nice movie!",
      "created_at": "2026-04-21T12:00:00.000Z",
      "username": "client1"
    }
  }
}

❌ Errors

{
  "error": {
    "code": "COMMENT_NOT_FOUND"
  }
}


# 🔹 3. Create Comment

POST /comments

📤 Request Body

{
  "comment": "Great film!",
  "movie_id": 10
}

📥 Response

{
  "success": {
    "data": {
      "id": 5,
      "content": "Great film!",
      "user_id": 1,
      "movie_id": 10,
      "created_at": "2026-04-21T12:00:00.000Z"
    }
  }
}


❌ Errors

{
  "error": {
    "code": "MISSING_COMMENT_OR_MOVIE_ID"
  }
}


# 🔹 4. Update Comment

PATCH /comments/:id

📤 Request Body

{
  "comment": "Updated comment"
}

📥 Response

{
  "success": {
    "data": {
      "id": 5,
      "content": "Updated comment",
      "user_id": 1,
      "movie_id": 10,
      "created_at": "2026-04-21T12:00:00.000Z"
    }
  }
}


❌ Errors

{
  "error": {
    "code": "COMMENT_IS_REQUIRE"
  }
}


{
  "error": {
    "code": "NOT_ALLOWED_OR_NOT_FOUND"
  }
}


📌 Notes

Only the owner of the comment can update it


# 🔹 5. Delete Comment

DELETE /comments/:id

📥 Response

{
  "success": {
    "code": "SUCCESS"
  }
}


❌ Errors

{
  "error": {
    "code": "NOT_ALLOWED_OR_NOT_FOUND"
  }
}


📌 Notes

Only the owner can delete their comment

# ⚠️ Global Error

Server Error

{
  "error": {
    "code": "GENERAL_ERROR"
  }
}



