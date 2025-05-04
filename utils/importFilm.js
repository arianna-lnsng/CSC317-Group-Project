/**
 * This module imports a movie's data from TMDb and saves it to the database using the Title model.
 */

const { searchMovie, getMovieDetails, getMovieCredits, getMovieKeywords } = require('../routes/api/tmdb');
const Title = require('../models/Title');

/**
 * Imports a movie from TMDb based on its title and stores it in the MongoDB `titles` collection.
 * If the movie already exists in the database (matched by name), it will return the existing entry.
 *
 * @param {string} titleName - The name of the movie to import
 * @returns {Promise<Object>} The newly created or existing Title document
 * @throws Will throw an error if the movie is not found or the API fails
 */
async function importFilm(titleName) {
  // Check if the movie already exists in the database (case-insensitive match)
  const existing = await Title.findOne({ name: new RegExp(`^${titleName}$`, 'i') });
  if (existing) {
    console.log(`ℹ️  Movie "${titleName}" already exists in the database.`);
    return existing;
  }

  // Search TMDb for the movie by title
  const searchResult = await searchMovie(titleName);
  if (!searchResult) throw new Error('Movie not found');

  const movieId = searchResult.id;

  // Fetch full movie details from TMDb
  const details = await getMovieDetails(movieId);
  const keywords = await getMovieKeywords(movieId);

  // Fetch credits to extract the director's name
  const credits = await getMovieCredits(movieId);
  const directorObj = credits.crew.find(person => person.job === 'Director');
  const director = directorObj ? directorObj.name : 'Unknown';

  // Use TMDb poster if available; fallback to a placeholder
  const posterPath = details.poster_path
    ? `https://image.tmdb.org/t/p/original${details.poster_path}`
    : 'https://placehold.co/500x750';

  // Create a new Title document using the imported data
  const newTitle = new Title({
    name: details.title,
    director,
    duration: details.runtime || 0,
    imageUrl: posterPath,
    genre: details.genres?.[0]?.name?.toLowerCase() || 'unknown',
    releaseYear: parseInt(details.release_date?.split('-')[0]) || null,
    keywords: keywords
  });

  // Save the movie to the database
  await newTitle.save();
  return newTitle;
}

module.exports = importFilm;
