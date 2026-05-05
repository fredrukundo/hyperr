



# III.2.2 Thumbnails

• The page will be sortable and filterable according to criteria such as name, genre,
IMDb (OMDb or TMDb for free API) grade, production year, etc.


# III.3 Video Part


• To launch the video on the server we must, if the file was not downloaded prior,
the associated torrent on the server will be launched, and the video stream will
be initiated as soon as enough data has been downloaded to ensure a seamless
watching experience. Any treatment must be done in the background in a non-
blocking manner.

• Once the movie is entirely downloaded, it will be saved on the server, to avoid
the need to re-downloading in the future. However, if a movie is unwatched for a
month, it will be erased.


• If English subtitles are available for the video, they will be downloaded and made
available for the video player. Additionally, if the language of the video does not
match the preferred language of the user and subtitles are available,the subtitles
will be downloaded and selectable.

• If the video is not natively readable for the browser 1, it will be converted on the
fly into an acceptable format. At minimum, mkv support is required.


# III.4 API

Develop a RESTful API with an OAuth2 authentication that can be used to obtain
basic information about this project.

• Any user can access the website’s « front page », which displays basic inforation
about the top movies.

    • A GET request on a movie should return all the relevant information that has
    been previously collected.

[OK]    • Authenticated users can access user comments via /comments/ :id and movie/ :id/-
        comments. They can also post a comment using an appropriate payload.


[OK]    GET /movies 
        returns the list of movies available on the frontpage, with their id and their name

[OK]    GET /movies/:id
        return a movie’s name, id, imdB (OMDb or TMDb for free API) mark, production year, length, available subtitles, number of comments


# Bonus part

• More API routes to add, delete movies, etc.

