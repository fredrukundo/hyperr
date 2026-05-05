SCALE FOR PROJECT HYPERTUBE
(/PROJECTS/HYPERTUBE)
Introduction
We ask you, for the good progress of this notation:
- To remain courteous, polite, respectful, constructive during this exchange. The bond of trust between the community 42 and you
depends on it.
- To highlight to the group the possible malfunctions.
- To accept that there may sometimes be differences of interpretation on the subject's requests or the range of functionalities. Stay
open-minded about the other's vision (is it right or wrong?), And write down as honestly as you can.
Good defense to all!
Guidelines
REMEMBER THAT YOU MUST CORRECATE ONLY WHAT IS ON THE STUDENT'S DEPOSIT.
This is to make a "git clone" of the rendering depot, and correct what is there.
Attachments
 Hypertube (https://cdn.intra.42.fr/pdf/pdf/6788/hypertube.en.pdf)
preliminaries
Preliminary instructions
An author file must be present at the rendering root.
Check with the supported students the libraries used for the project.
Libraries to go directly from a torrent to a video stream are prohibited: the use of a library such as webtorrent, pulsar or peerflix is
therefore a case of cheating.
(https://profile.intra.42.fr)
 search... 
0
trevor
If there is cheating, the defense stops.
Also, if, during the defense, there is only one warning, error or notice in the web console, select Crash at the top of the scale.
An error code of 500 to 599 is also considered a crash.
security
The subject insisted on this point: the site must be secure. Check at least that:
- the passwords are encrypted in the database
- the entry and upload forms have validations
- no SQL injection possible
If one of these points is not valid, the defense s 'stopped.
users
Creation and management of user account
A user must be able to register, providing at least:
- email address
- username
- profile picture
- first and last name
- password (secure, any current French word should not be accepted, for example )
This information must be editable by the user connected.
User login
Registration and login must be possible via Omniauth. Two minimum strategies are required: the strategy 42, and a free choice of
support.
 Yes  No.
 Yes  No.
 Yes  No.
The user must be able to log in with his credentials, and must be able to receive an email to reset his password in case of
forgetfulness.
Disconnection must be possible from any page of the site.
Library
Access
The library is only accessible to connected users?
Default view
By default, when no search has been performed, the library must display thumbnails of the most popular media sources not managed
by the application. This list must be sorted (according to a criterion chosen by the supporters).
Miniatures
The thumbnails must consist of the name of the video, as well as, if available, its production year, its score and a cover image.
On the most popular media, all this information should logically be available.
Videos viewed must be clearly differentiated from unseen videos.
Pagination and sorting
The video list must be paged, and the pages must be automatically loaded asynchronously.
The list must be sortable according to different criteria.
 Yes  No.
 Yes  No.
 Yes  No.
 Yes  No.
Research
The search engine must query at least two separate external sources, and limit the results to the videos.
The result of a search must be displayed as thumbnails sorted by name.
Try to search for a video, you can have an example with `curl http://www.randomlists.com/random-movies\?qty\=1 | cat | ruby
-e "p gets.match (/ port '> ([^ <] *) /) [1]" `.
Video part
Access
The section with the player is only accessible to connected users?
Information about the video
In addition to the player, the video section must present information about the video in progress. Test with a popular video, you
should have the summary, the cast, the year of production, etc.
We must also find the list of comments left by users for the video, as well as the possibility of leaving a new comment.
Download a video
The launch of a video must launch the download of the video on the server via the BitTorrent protocol. As soon as full uninterrupted
playback is possible, the player starts to stream the video.
The download must be in background, non-blocking way.
 Yes  No.
 Yes  No.
 Yes  No.
 Yes  No.
Conversion of videos
When the video is not natively readable by the browser, it must be converted on the fly so that it can be streamed. At a minimum, the
mkv format must be supported.
For example, this magnet must be streamable: `magnet:? Xt = urn: btih: 79816060ea56d56f2a2148cd45705511079f9bca & dn =
TPB.AFK.2013.720p.h264-SimonKlose & tr = udp% 3A% 2F% 2Ftracker.openbittorrent.com% 3A80 & tr = udp% 3A% 2F%
2Fopen.demonii.com% 3A1337 & tr = udp% 3A% 2F% 2Ftracker.coppersurfer.tk% 3A6969 & tr = udp% 3A% 2F%
2Fexodus.desync.com% 3A6969`
Saving videos
A video already downloaded (by any user) must be saved on the server, and deleted if it has not been viewed for a month.
Obviously, the launch of a video already present on the server must not re-download, but stream from the copy on the server.
Subtitles
If English subtitles are available for the video, they must be automatically downloaded and selectable directly on the player.
Similarly, if the language of the video does not match the user's preferred language and subtitles are available, they must be
automatically downloaded and selectable.
Good practices
Look & feel
The project is the result of several weeks of group work, it must be a minimum success!
Is the layout clear, with a header, a main section and a footer? The operation of the site is intuitive? It is reactive?
 Yes  No.
 Yes  No.
 Yes  No.
 Yes  No.
A lambda user quickly understands how to register? How to search?
Check Yes if the finished product seems to be successful and user-friendly.
Compatibility
The site is compatible on Firefox (> = 41) and Chrome (> = 46)?
Mobile
The site is presentable on mobile and on small resolutions?
bonus
RESTful API
The application has a RESTful API?
Other bonuses
It is possible here to count up to 5 bonuses, whose usefulness and relevance are judged at the discretion of the corrector.
As an example, here are the bonuses proposed in the subject:
- additional Omniauth strategies (1 graduation per additional strategy)
- management of different video resolutions
- video streaming via the MediaStream API
- etc ...
Rate it from 0 (failed) through 5 (excellent)
 Yes  No.
 Yes  No.
 Yes  No.
 Yes  No.
ratings
Do not forget to check the flag
 Okay  Outstanding project
 Empty work  Incomplete work  No author file  cheat d Crash
 Incomplete group l Forbidden function
Conclusion
Leave a comment on this evaluationPreview !!!
General term of use of the website
(https://signin.intra.42.fr/legal/terms/6)
Privacy policy
(https://signin.intra.42.fr/legal/terms/5)
Legal notices
(https://signin.intra.42.fr/legal/terms/3)
Declaration on the use of cookies
(https://signin.intra.42.fr/legal/terms/2)
Terms of use for video monitoring
(https://signin.intra.42.fr/legal/terms/1)
R
(https://sign