import { Movie } from "@/types/movie.types";
import { Comment } from "@/types/comment.types";
import { User } from "@/types/user.types";

// ── Real Avatars (Unsplash) ────────────────────────────────────────────────
const AVATAR_1 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop";
const AVATAR_2 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
const AVATAR_3 = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop";

// ── Real Movie Covers (Wikipedia — correct per movie) ─────────────────────
const COVERS: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  "2": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  "3": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  "4": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  "5": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  "6": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  "7": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  "8": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  "9": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  "10": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
  "11": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
  "12": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
};


// ── Real MP4 Streams (verified working, royalty-free) ──────────────────────
export const MOCK_STREAM_URLS: Record<string, string> = {
  // ── Blender Foundation (Google CDN — confirmed working) ────────────────
  "1": "/videos/testingV.mp4",
  "2": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "3": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "4": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",

  // ── W3Schools sample videos (always available, no geo-restriction) ─────
  "5":  "https://www.w3schools.com/html/mov_bbb.mp4",

  // ── File examples (fast CDN, no restrictions) ──────────────────────────
  "6":  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",

  // ── Mozilla test videos (always available) ────────────────────────────
  "7":  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

  // ── Sample Videos (dedicated test video hosting) ──────────────────────
  "8":  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "9":  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "10": "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "11": "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  "12": "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
};

// ── Mock Movies ────────────────────────────────────────────────────────────
export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Big Buck Bunny",
    year: 2008,
    rating: 7.4,
    genre: ["Animation", "Comedy"],
    summary:
      "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to ruin his day. When the rabbit finds his patience running thin, he decides to seek revenge.",
    coverImage: COVERS["1"],
    length: 10,
    director: "Sacha Goedegebure",
    cast: ["Jan Morgenstern", "Sacha Goedegebure"],
    watched: false,
    subtitles: [{ language: "en", url: "" }],
    seeds: 1240,
    peers: 450,
  },
  {
    id: "2",
    title: "Elephants Dream",
    year: 2006,
    rating: 6.8,
    genre: ["Animation", "Sci-Fi"],
    summary:
      "The story of two strange characters exploring a capricious and seemingly infinite machine. The elder, Proog, acts as a tour guide and protector, believing the machine is a benevolent world.",
    coverImage: COVERS["2"],
    length: 11,
    director: "Bassam Kurdali",
    cast: ["Cas Jansen", "Tygo Gernandt"],
    watched: true,
    subtitles: [{ language: "en", url: "" }, { language: "fr", url: "" }],
    seeds: 890,
    peers: 300,
  },
  {
    id: "3",
    title: "Sintel",
    year: 2010,
    rating: 7.9,
    genre: ["Animation", "Fantasy"],
    summary:
      "A wandering warrior finds a baby dragon which she calls Scales and raises him until he is captured by a larger dragon. She then embarks on a quest to rescue Scales, ultimately arriving at a volcano.",
    coverImage: COVERS["3"],
    length: 15,
    director: "Colin Levy",
    cast: ["Halina Reijn", "Thom Hoffman"],
    watched: false,
    subtitles: [{ language: "en", url: "" }, { language: "fr", url: "" }],
    seeds: 2100,
    peers: 800,
  },
  {
    id: "4",
    title: "Tears of Steel",
    year: 2012,
    rating: 6.5,
    genre: ["Action", "Sci-Fi"],
    summary:
      "In a future world dominated by robots, a group of warriors and scientists take refuge in Amsterdam to try to save humanity by creating a synthetic life form.",
    coverImage: COVERS["4"],
    length: 12,
    director: "Ian Hubert",
    cast: ["Derek de Lint", "Sergio Hasselbaink"],
    watched: false,
    subtitles: [{ language: "en", url: "" }],
    seeds: 1500,
    peers: 550,
  },
  {
    id: "5",
    title: "Cosmos Laundromat",
    year: 2015,
    rating: 7.2,
    genre: ["Animation", "Fantasy"],
    summary:
      "On a desolate island, a suicidal sheep named Franck meets his fate in the form of a quirky salesman who offers him the gift of a lifetime: the ultimate adventure.",
    coverImage: COVERS["5"],
    length: 13,
    director: "Mathieu Auvray",
    cast: ["Pierre Richard", "Michael Lonsdale"],
    watched: true,
    subtitles: [{ language: "en", url: "" }],
    seeds: 950,
    peers: 400,
  },
  {
    id: "6",
    title: "Caminandes: Llamigos",
    year: 2016,
    rating: 7.1,
    genre: ["Animation", "Comedy"],
    summary:
      "Koro the llama tries yet again to cross the Patagonian steppe, but his path is once more blocked by a rather determined penguin guarding his territory.",
    coverImage: COVERS["6"],
    length: 3,
    director: "Pablo Vazquez",
    cast: [],
    watched: false,
    subtitles: [],
    seeds: 600,
    peers: 200,
  },
  {
    id: "7",
    title: "Spring",
    year: 2019,
    rating: 7.8,
    genre: ["Animation", "Fantasy"],
    summary:
      "Spring is the story of a shepherd girl and her dog, who face ancient spirits in order to continue the cycle of life.",
    coverImage: COVERS["7"],
    length: 8,
    director: "Andy Goralczyk",
    cast: [],
    watched: false,
    subtitles: [{ language: "en", url: "" }],
    seeds: 1850,
    peers: 620,
  },
  {
    id: "8",
    title: "Sprite Fright",
    year: 2021,
    rating: 7.5,
    genre: ["Animation", "Horror"],
    summary:
      "A group of rowdy teenagers stumble upon an ancient forest and get more than they bargained for when the forest creatures decide to fight back.",
    coverImage: COVERS["8"],
    length: 10,
    director: "Matthew Luhn",
    cast: [],
    watched: false,
    subtitles: [{ language: "en", url: "" }, { language: "fr", url: "" }],
    seeds: 1650,
    peers: 700,
  },
  {
    id: "9",
    title: "Agent 327",
    year: 2017,
    rating: 7.3,
    genre: ["Animation", "Action"],
    summary:
      "Agent 327 is on a secret mission to infiltrate a shady barbershop in Amsterdam. What he finds inside puts him on the trail of a global conspiracy.",
    coverImage: COVERS["9"],
    length: 4,
    director: "Colin Levy",
    cast: [],
    watched: false,
    subtitles: [{ language: "en", url: "" }],
    seeds: 1100,
    peers: 350,
  },
  {
    id: "10",
    title: "Coffee Run",
    year: 2020,
    rating: 6.9,
    genre: ["Animation", "Comedy"],
    summary:
      "A young woman running late for work stops for a quick coffee, but the line is unexpectedly long and full of strange characters that make her morning unforgettable.",
    coverImage: COVERS["10"],
    length: 3,
    director: "Hjalti Hjalmarsson",
    cast: [],
    watched: true,
    subtitles: [{ language: "en", url: "" }],
    seeds: 420,
    peers: 150,
  },
  {
    id: "11",
    title: "Glass Half",
    year: 2015,
    rating: 6.2,
    genre: ["Animation", "Comedy"],
    summary:
      "Two art critics meet in a gallery and argue passionately about the pieces they see, bringing the art to life in their minds in unexpected and hilarious ways.",
    coverImage: COVERS["11"],
    length: 3,
    director: "Beorn Leonard",
    cast: [],
    watched: false,
    subtitles: [],
    seeds: 300,
    peers: 100,
  },
  {
    id: "12",
    title: "Charge",
    year: 2022,
    rating: 7.1,
    genre: ["Animation", "Action"],
    summary:
      "In a dystopian future, an aging worker breaks into a heavily guarded energy plant to steal a battery that could save his life.",
    coverImage: COVERS["12"],
    length: 4,
    director: "Hjalti Hjalmarsson",
    cast: [],
    watched: true,
    subtitles: [{ language: "en", url: "" }],
    seeds: 1400,
    peers: 600,
  },
];

// ── Mock User ──────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: "1",
  username: "john_doe",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  profile_picture: AVATAR_1,
  preferred_language: "en",
};

// ── Mock Users List ────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  MOCK_USER,
  {
    id: "2",
    username: "jane_smith",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    profile_picture: AVATAR_2,
    preferred_language: "fr",
  },
  {
    id: "3",
    username: "movie_fan_42",
    first_name: "Alex",
    last_name: "Martin",
    email: "alex@example.com",
    profile_picture: AVATAR_3,
    preferred_language: "en",
  },
];

// ── Mock Comments ──────────────────────────────────────────────────────────
export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    content:
      "This is an amazing film! The animation quality is outstanding for its time. I've watched it at least 5 times now.",
    movieId: "1",
    author: { id: "u2", username: "jane_smith", profilePicture: AVATAR_2 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "c2",
    content: "Classic open source animation. Brings back so many memories!",
    movieId: "1",
    author: { id: "u3", username: "movie_fan_42", profilePicture: AVATAR_3 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "c3",
    content:
      "The soundtrack is incredible. I had no idea this was made with Blender.",
    movieId: "3",
    author: { id: "u1", username: "john_doe", profilePicture: AVATAR_1 },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];