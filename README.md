# After the Credits - Your Digital Film Community

![Preview](images/preview.jpg)

## Overview
*After the Credits* is a modern film review and discovery platform where cinephiles can browse, rate, and discuss movies. Built with Node.js, Express, MongoDB, and EJS, it features a responsive, card-based UI and robust backend API. Users can search, filter, review, and rate films, as well as manage a personal watchlist.

## Team Members and Roles
- **Cielina Maree Lubrino** (Frontend Lead): Page layouts, HTML, CSS, and responsive design.
- **Rama Harish Varma Vegesna** (UI/UX & Interactivity): JavaScript interactivity, form validation, star ratings, and usability.
- **Damian Perez** (Backend Lead): Express routes, server-side validation, reviews/ratings logic.
- **Arianna Lansang** (Data & Coordination): Database seeding, structure, and documentation.

## Preview
![Browse Movies UI](images/preview.jpg)

## Features
- **Browse Films:** Card-style layout with posters, genres, years, and ratings.
- **Search & Filter:** Search by title or director. Filter by genre, year, or rating.
- **Film Details:** View director, duration, genre, release year, and more.
- **Ratings:** Rate films (1–5 stars), see average ratings, and rating distribution.
- **Reviews:** Write, edit, and delete reviews. Reviews are timestamped and linked to users.
- **Watchlist:** Add/remove films to a personal watchlist (requires login).
- **Personalization:** Get suggestions by genre, director, or similar themes.
- **Authentication:** Secure login/register, session management, and protected routes.

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS templates, HTML5, CSS3, Vanilla JS
- **Styling:** Custom CSS (`public/css/style.css`)
- **Auth:** express-session, bcrypt, JWT
- **API Integration:** TMDB API (for film data/images)

## Project Structure
```tree
CSC317-Group-Project/
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── Procfile              # Render process definition
├── README.md             # Project README file
├── app.js                # Main application entry point
├── config/               # App configuration
├── controllers/          # Route handlers and business logic
├── images/               # Project images (including preview.jpg)
├── middleware/           # Custom middleware
├── models/               # Mongoose schemas (Title, Review, User, Rating)
├── package-lock.json     # Dependency lockfile
├── package.json          # Project dependencies and scripts
├── public/               # Static assets (CSS, JS, images)
│   ├── css/              # Main stylesheet(s)
│   ├── js/               # Main JS (interactivity)
│   └── images/           # Public images
├── render.yaml           # Render deployment config
├── routes/               # Express routes
│   ├── api/              # API endpoints (REST)
│   └── ...               # Web routes
├── utils/                # Utility scripts and seeders
│   └── seeders/          # Database seeding scripts
└── views/                # EJS templates
    ├── layouts/          # Layout templates
    ├── partials/         # Shared partials
    ├── auth/             # Auth pages
    ├── titles/           # Title/movie pages
    ├── user/             # User dashboard/pages
    └── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd CSC317-Group-Project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/after_the_credits?retryWrites=true&w=majority
   SESSION_SECRET=your_secure_session_key
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   NODE_ENV=development
   ```
4. Seed the database with initial data:
   ```bash
   node utils/seeders/seed.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser at `http://localhost:3000`

### Deployment (Render)
- See `render.yaml` and `Procfile` for deployment configuration.
- Add environment variables in Render dashboard as above.
- Use `npm install` as build command and `node app.js` as start command.

### MongoDB Atlas Setup
- Create a free cluster, user, and network access as described above.
- Add your connection string to `.env` and Render dashboard.

## API Documentation

### Models
- **Title:** name, director, duration, imageUrl, genre, releaseYear, averageRating, totalRatings, keywords
- **Review:** titleId, userId, reviewTitle, content, rating, createdAt, updatedAt
- **Rating:** userId, titleId, rating, createdAt
- **User:** username, email, password, watchlist, filmsWatched, createdAt

### REST Endpoints (routes/api/)
- `GET /api/titles` — List/search/filter films
- `GET /api/titles/:id` — Get film details
- `GET /api/titles/:id/similar` — Similar films
- `GET /api/titles/:id/reviews` — Reviews for a film
- `GET /api/titles/:id/ratings` — Rating stats for a film
- `POST /api/titles` — Add a film (auth required)
- `PUT /api/titles/:id` — Update a film (auth required)
- `DELETE /api/titles/:id` — Delete a film (auth required)
- `GET /api/reviews` — All reviews
- `POST /api/reviews` — Add review (auth required)
- `PUT /api/reviews/:id` — Edit review (owner only)
- `DELETE /api/reviews/:id` — Delete review (owner only)
- `POST /api/ratings` — Rate a film (auth required)
- `GET /api/ratings/user/:titleId` — User's rating for a film
- `GET /api/ratings/title/:titleId` — Average rating for a film
- `GET /api/ratings/title/:titleId/all` — All ratings for a film
- `DELETE /api/ratings/:titleId` — Remove user's rating (auth required)
- `POST /api/lists/add` — Add to watchlist (auth required)
- `POST /api/lists/remove` — Remove from watchlist (auth required)
- `GET /api/lists/watchlist` — User's watchlist (auth required)
- `GET /api/lists/check/watchlist/:titleId` — Check if in watchlist (auth required)

### Authentication & Validation
- Auth required for user actions (session-based)
- Data validation for all models and endpoints
- Consistent error format: `{ "error": "Error message here" }`