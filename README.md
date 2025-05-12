# After the Credits - Your Digital Film Community

## Overview
*After the Credits* is a dynamic film review platform where cinephiles can discover, rate, and discuss their favorite films. Built for the CSC317 final group assignment, it combines a modern, responsive frontend with an Express.js backend and MongoDB database, creating an immersive space for film enthusiasts.

## Team Members and Roles
- **Cielina Maree Lubrino** (Frontend Lead): Builds page layouts using standard HTML and CSS; ensures all pages are responsive on mobile and desktop.
- **Rama Harish Varma Vegesna** (UI/UX & Interactivity): Handles form validation, interactive features like star rating, and improves overall usability using JavaScript.
- **Damian Perez** (Backend Lead): Implements routes using Express.js, manages server-side validation, and handles storing/retrieving reviews and ratings.
- **Arianna Lansang** (Data & Coordination): Seeds the app with starter data, manages the database structure, and documents team progress and testing plans.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)

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

3. Create a `.env` file in the root directory with the following content:
   ```env
   # Use your MongoDB connection string (local or Atlas)
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/after_the_credits?retryWrites=true&w=majority
   
   # Secret key for session management
   SESSION_SECRET=your_secure_session_key
   
   # Secret key for JWT signing (authentication)
   JWT_SECRET=your_jwt_secret_key

   # API Key for The Movie Database (TMDB)
   TMDB_API_KEY=your_tmdb_api_key
   
   # Environment (development or production)
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

6. Open your browser and navigate to:  
   `http://localhost:3000`

## Deployment

### Deploying to Render

1. Create a Render account at https://render.com

2. Create a new Web Service:
   - Connect your GitHub repository
   - Choose the repository and branch
   - Render will automatically detect the Node.js application

3. Configure the service:
   - **Name**: CSC317_GROUP-A
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`

4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 10000 (Render will override this, but it's good to have)
   - `JWT_SECRET`: The same secret key you used locally
   - `NODE_ENV`: production

5. Deploy the service:
   - Click 'Create Web Service'
   - Render will automatically build and deploy your application

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

2. Create a new cluster:
   - Choose the free tier option
   - Select a cloud provider and region
   - Create cluster

3. Set up database access:
   - Create a database user
   - Save the credentials securely

4. Configure network access:
   - Add your IP address
   - For production, allow access from anywhere (0.0.0.0/0)

5. Get your connection string:
   - Click 'Connect'
   - Choose 'Connect your application'
   - Copy the connection string
   - Replace `<password>` with your database user's password

6. Add the connection string to Render:
   - Go to your web service dashboard
   - Add `MONGODB_URI` environment variable
   - Paste your MongoDB Atlas connection string

## Features

### Film Reviews
- Add and discover films with comprehensive details including director, duration, genre, and release year
- Browse films in an elegant card-style layout
- Share your thoughts on films after watching them

### Ratings (1–5 Stars)
- Rate any film from 1 to 5 stars.
- Display average rating per film.

### Write & Edit Reviews
- Post reviews with a title and content.
- Edit or delete your own reviews.
- Reviews are timestamped and linked to usernames.

### Discover More
- Get personalized film suggestions based on genre, director, or similar themes
- Explore curated collections and trending discussions

### Search & Filter
- Search films by title or director.
- Filter films by genre, year, or minimum rating.

### Watchlist
- Save films to personal watchlist.
- Manage saved films (add/remove).
- Requires user authentication.

## Project Structure

```tree
.
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── Procfile              # Render process definition
├── README.md             # Project README file
├── app.js                # Main application entry point
├── config/               # Configuration files
├── controllers/          # Route handlers and business logic
├── middleware/           # Custom middleware functions
├── models/               # Database models/schemas
├── package-lock.json     # Exact dependency versions
├── package.json          # Project dependencies and scripts
├── public/               # Static assets (CSS, JS, images)
├── render.yaml           # Render deployment configuration
├── routes/               # Application routes
├── utils/                # Utility functions and helpers
└── views/                # Server-side templates (e.g., EJS)

```
*(Note: `node_modules`, `.git`, and other configuration-specific hidden files/directories are omitted from this view for clarity)*

## Backend API Documentation

### Models

#### Title
Represents a film in the database.
```javascript
{
  name: String,          // Film title
  director: String,      // Film director
  duration: Number,      // Length in minutes
  imageUrl: String,      // Poster image URL (IMDB/TMDB/alternate)
  genre: String,         // Film genre
  releaseYear: Number,   // Year of release
  averageRating: Number, // Seeded with a realistic value
  totalRatings: Number,  // Number of ratings received
  keywords: [String]     // Related keywords/tags
}
```

#### Review
User-submitted reviews for films.
```javascript
{
  titleId: ObjectId,     // Reference to the film
  userId: ObjectId,      // User who wrote the review
  reviewTitle: String,   // Review headline
  content: String,       // Review content
  rating: Number,        // Rating (1-5)
  createdAt: Date,       // Review submission date
  updatedAt: Date        // Last modification date
}
```

#### Rating
Stand-alone ratings for films.
```javascript
{
  userId: ObjectId,      // User who rated
  titleId: ObjectId,     // Film that was rated
  rating: Number,        // Rating value (1-5)
  createdAt: Date        // Rating submission date
}
```

#### User
User account with watchlist functionality.
```javascript
{
  username: String,      // Unique username
  email: String,         // User's email
  password: String,      // Hashed password
  watchlist: [ObjectId], // Films to watch
  filmsWatched: Number,  // Count of films marked as watched
  createdAt: Date        // Account creation date
}
```

## API Endpoints

### Films
- `GET /api/titles`: Get all films (supports query parameters: genre, director, minRating, search)
- `GET /api/titles/:id`: Get a specific film
- `GET /api/titles/:id/similar`: Get similar films based on genre or director
- `GET /api/titles/:id/reviews`: Get all reviews for a specific title
- `GET /api/titles/:id/ratings`: Get rating statistics for a specific title
- `POST /api/titles`: Create a new title (authentication required)
- `PUT /api/titles/:id`: Update a title (authentication required)
- `DELETE /api/titles/:id`: Delete a title (authentication required)

### Reviews
- `GET /api/reviews`: Get all reviews
- `GET /api/reviews/:id`: Get a specific review
- `POST /api/reviews`: Create a new review (authentication required)
- `PUT /api/reviews/:id`: Update a review (owner only)
- `DELETE /api/reviews/:id`: Delete a review (owner only)

### Ratings
- `POST /api/ratings`: Submit a rating for a title (authentication required)
- `GET /api/ratings/user/:titleId`: Get the user's rating for a specific title (authentication required)
- `GET /api/ratings/title/:titleId`: Get average rating for a specific title
- `GET /api/ratings/title/:titleId/all`: Get all ratings for a title with distribution data
- `DELETE /api/ratings/:titleId`: Remove a user's rating for a title (authentication required)

### Lists
- `POST /api/lists/add`: Add a film to watchlist (authentication required)
- `POST /api/lists/remove`: Remove a film from watchlist (authentication required)
- `GET /api/lists/watchlist`: Get user's watchlist (authentication required)
- `GET /api/lists/check/watchlist/:titleId`: Check if a film is in user's watchlist (authentication required)
  
## Authentication
Routes marked with "(authentication required)" require a valid session (`req.session.userId`).

Authentication Middleware:
- `isAuthenticated`: Ensures a user is logged in
- Owner-only checks: Ensure user owns the resource before updating or deleting

## Data Validation
- Titles must include required fields and correct formats.
- Ratings must be between 1 and 5.
- Reviews must have a title and valid rating.

## Error Handling
All API responses use a consistent error format:
```json
{
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Seeded Movies

The database is seeded with 14 classic and popular films, each with a realistic average rating based on critical and audience reputation. The current seed set is:

- The Shawshank Redemption (4.9)
- The Godfather (4.9)
- Inception (4.7)
- Scream (4.0)
- Twilight (3.2)
- The Grand Budapest Hotel (4.3)
- Pulp Fiction (4.8)
- Toy Story (4.6)
- Jurassic Park (4.5)
- Forrest Gump (4.7)
- The Matrix (4.7)
- The Dark Knight (4.8)
- Interstellar (4.6)
- Parasite (4.6)

Poster images are a mix of IMDB and TMDB poster URLs, with some alternate covers for variety and reliability.

The search and autocomplete features are designed to work with these 14 movies, supporting search by title and director.
