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
   MONGODB_URI=mongodb://localhost:27017/after_the_credits
   SESSION_SECRET=your_secure_session_key
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

## Directory Structure
```
├── controllers/        # Route handlers and business logic
├── models/            # MongoDB schema definitions
├── public/            # Static files (CSS, client-side JS)
├── routes/            # Express route definitions
│   └── api/          # API route handlers
├── utils/            # Helper functions and utilities
│   └── seeders/     # Database seeding scripts
├── views/            # EJS templates
├── app.js            # Main application entry point
└── package.json      # Project dependencies and scripts
```

## Backend API Documentation

### Models

#### Title
Represents a film in the database.
```javascript
{
  name: String,          // Film title
  director: String,      // Film director
  duration: Number,      // Length in minutes
  imageUrl: String,      // Poster image URL
  genre: String,         // Film genre
  releaseYear: Number,   // Year of release
  averageRating: Number, // Calculated average rating
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
- Lists must use valid list type (`watchlist`).

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
