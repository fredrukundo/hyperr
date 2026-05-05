[OK]    • The app must allow a user to register asking for at least their email address,
        username, last name, first name and a password that is somehow protected.

[OK]    • The user must be able to log in with their username and password. They must be
        able to receive an email allowing them to reset their password should they forget
        it.

[OK]
        • The user must be able to register and log in via Omniauth. You must implement
        at least 2 strategies : the 42 strategy and another one of your choice.

[OK] (just destroy the jwt token)
        • The user must be able to log out with one click from any pages on the site.

[OK]    • The user must be able to select a preferred language that will default to English.
        A user must also be able to :
        • Modify their email address, profile picture and information.

[OK]    • View the profile of any other user, including their profile picture and information.
        However, the email address will remain private.

[OK]    This section can only be accessed by authenticated users.

        This section must have at a minimum :
        • A search field.
        • A list of video thumbnails.

[OK]    • If search has been done, the results will be displayed as thumbnails, sorted by
        names.

[OK]    • Watched and unwatched videos should be differentiate in the thumbnails.


[OK] 
        • If no research was done, the app will display the most popular video from the
        external sources, sorted by the criteria of your choice (downloads, peers, seeders,
        etc.)

[OK]   (IMDb rating will be configured, check the value if null put in the ui rating 0.0)
         • Each thumbnail must display the name of the video, its production year (if avai-
        lable), its IMDb (OMDb or TMDb for free API) rating (if available), and a cover
        image.

[OK]    • The list will be paginated, with the next page being loaded asynchronously as the
        user scrolls down. There should be no link to load the next page.

[OK]    • This section will present the details of a video, including a video player, if available
        summary, casting (at least producer, director, main cast etc.), the production year,
        length, IMDb (OMDb or TMDb for free API) grade, a cover image and anything
        else relevant.

[OK]    • Users will have the option of leaving a comment on the video, and the list of prior
        comments will be shown.

[OK]
        • Authenticated users are allowed to retrieve or update any profiles.


[OK]    Here’s a basic documentation : POST oauth/token
        Expects client + secret, returns an auth token

[OK]   GET /users -> returns a list of users with their id and their username

[OK]    GET /users -> returns a list of users with their id and their username

[OK]    GET /users/:id -> returns username, email address, profile picture URL

[OK]    PATCH /users/:id -> Expected data : username, email, password, profile picture URL

[OK]    GET /comments
        returns a list of latest comments which includes comment’s author username, date,
        content, and id.

[OK]    GET /comments/:id
        returns comment, author’s username, comment id, date posted

[OK]    PATCH /comments/:id
        Expected data : comment, username

[OK]    DELETE /comments/:id

[OK]    POST /comments OR POST /movies/:movie_id/comments
        Expected data : comment, movie_id. Rest is filled by the server.





