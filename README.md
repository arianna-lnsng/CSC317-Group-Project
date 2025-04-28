# Ink & Frame - Book and Movie Review Platform

## Project Overview
Ink & Frame is a full-stack web application where users can explore, rate, and review books and movies. It combines a responsive frontend with an Express.js backend and MongoDB database, focusing on real-world CRUD functionality.

## Team Members and Roles
- **Cielina Maree Lubrino** (Frontend Lead): Builds page layouts using standard HTML and CSS, ensures all pages are responsive on mobile and desktop
- **Rama Harish Varma Vegesna** (UI/UX & Interactivity): Handles form validation, interactive features like star rating, and improves overall usability using JavaScript
- **Damian Perez** (Backend Lead): Implements routes using Express.js, manages server-side validation, and handles storing/retrieving reviews and ratings
- **Arianna Lansang** (Data & Coordination): Seeds the app with starter data, manages database structure, and documents team progress and testing plans

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation
1. Clone the repository
   ```
   git clone [repository-url]
   cd CSC317-Group-Project
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a .env file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/ink_and_frame
   SESSION_SECRET=your_secure_session_key
   ```

4. Seed the database with initial data
   ```
   node utils/seeders/seed.js
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open your browser and navigate to http://localhost:3000

## Features
- Add books or movies with title, image, genre, and release year
- Browse titles in a card-style layout
- Rate titles from 1-5 stars with average ratings displayed
- Write, edit, and delete reviews with timestamps and usernames
- View title suggestions based on genre
- Search titles by name
- Filter results by genre or minimum rating
- Maintain personal watchlist or reading list
- User authentication

## Backend API Documentation

## Models

### Title
Represents a book or movie in the system.
- `name` (String, required): Name of the title
- `type` (String, required): Either 'book' or 'movie'
- `imageUrl` (String, required): URL to the title's image
- `genre` (String, required): Genre of the title
- `releaseYear` (Number, required): Year the title was released
- `averageRating` (Number): Average user rating (1-5)
- `totalRatings` (Number): Total number of ratings

### Review
User reviews for titles.
- `titleId` (ObjectId, required): Reference to the Title
- `userId` (ObjectId, required): Reference to the User
- `reviewTitle` (String, required): Heading for the review
- `content` (String): Main review text
- `rating` (Number, required): Rating from 1-5
- `createdAt` (Date): Timestamp of review creation

### Rating
Separate ratings for titles.
- `titleId` (ObjectId, required): Reference to the Title
- `userId` (ObjectId, required): Reference to the User
- `rating` (Number, required): Rating from 1-5

### User
Extended with lists functionality.
- Standard user fields (username, email, password)
- `watchlist` (Array of ObjectIds): References to Titles
- `readingList` (Array of ObjectIds): References to Titles

## API Endpoints

### Titles
- `GET /api/titles`: Get all titles
  - Query params: genre, minRating, type, search
- `GET /api/titles/:id`: Get a specific title
- `GET /api/titles/:id/similar`: Get similar titles (same genre)
- `POST /api/titles`: Create a new title (auth required)
- `PUT /api/titles/:id`: Update a title (auth required)
- `DELETE /api/titles/:id`: Delete a title (auth required)

### Reviews
- `GET /reviews`: Get all reviews
- `GET /reviews/:id`: Get a specific review
- `POST /reviews`: Create a new review (auth required)
- `PUT /reviews/:id`: Update a review (auth owner only)
- `DELETE /reviews/:id`: Delete a review (auth owner only)

### Ratings
- `POST /api/ratings`: Rate a title (auth required)
- `GET /api/ratings/:titleId`: Get user's rating for a title (auth required)
- `DELETE /api/ratings/:titleId`: Remove a rating (auth required)

### Lists
- `POST /api/lists/add`: Add title to watchlist/readingList (auth required)
  - Body: `{ titleId, listType }`
- `POST /api/lists/remove`: Remove title from list (auth required)
  - Body: `{ titleId, listType }`
- `GET /api/lists/:listType`: Get user's watchlist or readingList (auth required)

## Authentication
All routes marked with "auth required" need a valid session (req.session.userId).
The following middleware is used:
- `isAuthenticated`: Ensures user is logged in
- Owner-only operations check if the logged-in user owns the resource

## Data Validation
- Title validation includes required fields and proper formats
- Ratings must be between 1-5
- Reviews require a title and valid rating
- List operations validate the list type ('watchlist' or 'readingList')

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "error": "Error message here"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
