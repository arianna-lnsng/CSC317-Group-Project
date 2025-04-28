# Ink & Frame - Book and Movie Review Platform

## Overview
Ink & Frame is a full-stack web application where users can explore, rate, and review books and movies. Built for the CSC317 final group assignment, it combines a clean, responsive frontend with an Express.js backend and a MongoDB database, focusing on real-world CRUD functionality.

## Team Members and Roles
- **Cielina Maree Lubrino** (Frontend Lead): Builds page layouts using standard HTML and CSS; ensures all pages are responsive on mobile and desktop.
- **Rama Harish Varma Vegesna** (UI/UX & Interactivity): Handles form validation, interactive features like star rating, and improves overall usability using JavaScript.
- **Damian Perez** (Backend Lead): Implements routes using Express.js, manages server-side validation, and handles storing/retrieving reviews and ratings.
- **Arianna Lansang** (Data & Coordination): Seeds the app with starter data, manages the database structure, and documents team progress and testing plans.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
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
   MONGODB_URI=mongodb://localhost:27017/ink_and_frame
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

### Title Listings
- Add books or movies with a title, image, genre, and release year.
- Browse all titles in a card-style layout.

### Ratings (1–5 Stars)
- Rate any title from 1 to 5 stars.
- Display average rating per title.

### Write & Edit Reviews
- Post reviews with a title and content.
- Edit or delete your own reviews.
- Reviews are timestamped and linked to usernames.

### Title Suggestions
- View related titles from the same genre.

### Search & Filter
- Search titles by name.
- Filter titles by genre or minimum rating.

### Watchlist / Reading List
- Save titles to personal watchlists or reading lists.
- Manage saved titles (add/remove).
- Requires user authentication.

## Directory Structure
//TODO 

## Backend API Documentation

### Models

#### Title
Represents a book or movie.
//TODO

#### Review
User reviews for titles.
//TODO

#### Rating
Separate ratings for titles.
//TODO

#### User
Extended with lists functionality.
//TODO

## API Endpoints

### Titles
- `GET /api/titles`: Get all titles (supports query parameters: genre, minRating, type, search)
- `GET /api/titles/:id`: Get a specific title
- `GET /api/titles/:id/similar`: Get similar titles based on genre
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
- `POST /api/lists/add`: Add a title to a watchlist or reading list (authentication required)
- `POST /api/lists/remove`: Remove a title from a list (authentication required)
- `GET /api/lists/:listType`: Get user's watchlist or reading list (authentication required)
- `GET /api/lists/check/:listType/:titleId`: Check if a title is in a user's list (authentication required)
  
## Authentication
Routes marked with "(authentication required)" require a valid session (`req.session.userId`).

Authentication Middleware:
- `isAuthenticated`: Ensures a user is logged in
- Owner-only checks: Ensure user owns the resource before updating or deleting

## Data Validation
- Titles must include required fields and correct formats.
- Ratings must be between 1 and 5.
- Reviews must have a title and valid rating.
- Lists must use valid list types (`watchlist` or `readingList`).

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
