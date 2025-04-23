# Ink & Frame - Review Film & Books

## Overview
Ink & Frame is a full-stack web application where users can explore, rate, and review books and movies. This project is built for the CSC317 final group assignment to apply everything we've learned about web software development. It combines a clean, responsive frontend with an Express.js backend and focuses on building real-world CRUD functionality.

## Features

### Title Listings
- Add new books or movies to the app with a title, image, genre, and release year.
- Browse all submitted titles in a card-style layout.

### Ratings (1–5 Stars)
- Users can rate any title from 1 to 5 stars.
- Each title displays its average rating.

### Write & Edit Reviews
- Users can post reviews on any book or film.
- Reviews are saved with a timestamp and username.
- Users can edit or delete their own reviews.

### Title Suggestions
- When viewing a title, users are shown other titles from the same genre.
- Helps explore related content easily.

### Search & Filter
- Users can search by title name.
- Filter by genre or minimum rating to narrow down results.

### Watchlist / Reading List ✨
- Logged-in users can add titles to a personal watchlist or reading list.
- Each user can view and manage their saved titles in a separate section.
- Titles can be easily removed from the list.
- Requires user authentication and a many-to-many relationship between users and titles.

## Team Roles

| Name            | Role                   | Description                                                                 |
|-----------------|------------------------|-----------------------------------------------------------------------------|
| Cielina Maree Lubrino        | Frontend Lead          | Builds the page layout using standard HTML and CSS. Ensures all pages are responsive on mobile and desktop. |
| Rama Harish Varma Vegesna        | UI/UX & Interactivity  | Handles form validation, interactive features like star rating, and improves overall usability using JavaScript. |
| Damian Perez         | Backend Lead           | Implements routes using Express.js, manages server-side validation, and handles storing/retrieving reviews and ratings. |
| Arianna Lansang        | Data & Coordination    | Seeds the app with starter data, manages the database structure, and documents team progress and testing plans. |

## Directory Structure
```
assignments/
└── assignment-5/
├── app.js
├── package.json
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── routes/
│   └── api/
├── views/
├── middleware/
├── models/
├── config/
├── utils/
└── README.md
```
