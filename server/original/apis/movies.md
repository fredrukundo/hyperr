# 🎬 Movies API Documentation

🔐 Authentication

# All endpoints require authentication:

Authorization: Bearer <token>

# 1️⃣ Get Movies List

GET /movies

[FOR]    • The list will be paginated, with the next page being loaded asynchronously as the
            user scrolls down. There should be no link to load the next page.
            (PAGE: 1 LIMIT: 20),(PAGE: 20 LIMIT: 40), ect ...


📥 Query Params

| Param     | Type   | Default      | Description                      |
| --------- | ------ | ------------ | -------------------------------- |
| page      | number | 1            | Pagination page                  |
| limit     | number | 20 (max 100) | Items per page                   |
| search    | string | null         | Search keyword                   |
| sortBy    | string | downloads    | Sorting (e.g. downloads, rating) |
| year      | number | null         | Filter by year                   |
| minRating | number | null         | Minimum rating                   |

✅ Success Response

{
  "success": {
    "data": {
      "archive" : {},
      "yts" : {},
    }
  }
}

note: when the user clicks on any movie remeber to keep track (archive, yts)
so we can now which engine the movie are in , example : /movies/{movie_id}?engine=archive


❌ Errors

{
  "error": { "code": "GENERAL_ERROR" }
}

🧠 Frontend Notes

Use for homepage / browsing
Supports filtering + pagination
If no search → returns trending/popular (based on downloads)

# 2️⃣ Search Movies

GET /movies/search

📥 Query Params

| Param     | Type   | Required |
| --------- | ------ | -------- |
| keyword   | string | ✅        |

✅ Success Response

If keyword exists:

{
  "success": {
    "data": [...]
  }
}

If keyword missing:

{
  "success": {
    "data": null
  }
}

❌ Errors

{
  "error": { "code": "GENERAL_ERROR" }
}


🧠 Frontend Notes

Do NOT call API if search input is empty (optional optimization)
If called without keyword → returns null
Use for search page

# 3️⃣ Get Movie Details

GET /movies/:id

📥 Query Params

| Param  | Required | Value       |
| ------ | -------- | ----------- |
| engine | ✅        | `"archive or yts"` |

⚠️ Required Example

/movies/123?engine=archive
/movies/123?engine=yts

⚙️ Internal Behavior (Important for Frontend Understanding)

🧠 Caching System

First request → fetch from external API

Then saved in DB

Next requests → reuse cached data


✅ Success Response

{
    "id": 1,
    "api": "yts",
    "identifier": "76050",
    "title": "Ljósbrot",
    "year": 2024,
    "summary": "Una grapples with grief while harboring a secret, unable to fully express her emotions, as she navigates challenging events swirling around her.",
    "length": 82,
    "main_cast": "Atli Oskar Fjalarsson, Þorsteinn Bachmann, Benedikt Erlingsson, Baldur Einarsson",
    "imdb_rating": 6.6,
    "director": null,
    "cover_image": "https://yts.bz/assets/images/movies/ljosbrot_2024/large-cover.jpg",
    "downloaded_path": null,
    "torrent_link": "https://yts.bz/torrent/download/90A40760220A21D03CD745A569C4A89B79161DD3",
    "subtitles": null,
    "subtitle": null,
    "last_watched": "2026-05-02T17:40:46.625Z",
    "language": "is",
    "status": "not_downloaded",
    "created_at": "2026-05-02T17:40:46.625Z",
    "commentsCount": 0
}

❌ Errors

Missing or invalid engine

{
  "error": { "code": "ENGINE_MOST_BE_AVAILABLE" }
}

Movie not found

{
  "error": { "code": "MOVIE_NOT_FOUND" }
}


Incomplete movie data

{
  "error": { "code": "MOVIE_IS_MISSING_SOME_PART" }
}


General error

{
  "error": { "code": "GENERAL_ERROR" }
}

🧠 Frontend Notes

Always send:

engine = "archive"

Response contains:
movie → fresh data from API
movieDB → cached/saved version

👉 Use movie for UI (more reliable)










