/**
 * TMDb (The Movie Database) integration helper
 * This module provides functions to search for a movie, fetch its details, and get credits.
 */

require('dotenv').config();
const axios = require('axios');
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search for a movie by title using the TMDb API
 * @param {string} title - The movie title to search
 * @returns {Object} The first search result (or undefined if none found)
 */
async function searchMovie(title) {
  const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: { api_key: TMDB_API_KEY, query: title }
  });
  return res.data.results[0]; // Return the first match
}

/**
 * Fetch full details of a movie by TMDb movie ID
 * @param {number|string} id - The TMDb movie ID
 * @returns {Object} Movie details including title, runtime, genres, etc.
 */
async function getMovieDetails(id) {
  const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
    params: { api_key: TMDB_API_KEY }
  });
  return res.data;
}

/**
 * Get the full credits for a movie (cast and crew)
 * @param {number|string} id - The TMDb movie ID
 * @returns {Object} Cast and crew information
 */
async function getMovieCredits(id) {
  const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, {
    params: { api_key: TMDB_API_KEY }
  });
  return res.data;
}

/**
 * Get keywords for a movie from TMDb
 * @param {number|string} id - The TMDb movie ID
 * @returns {Array<string>} A list of keyword names
 */
async function getMovieKeywords(id) {
  const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}/keywords`, {
    params: { api_key: TMDB_API_KEY }
  });

  // Return just the keyword names
  return res.data.keywords?.map(k => k.name.toLowerCase()) || [];
}

// Export all three functions for use in other files (e.g. importFilm.js)
module.exports = {
  searchMovie,
  getMovieDetails,
  getMovieCredits,
  getMovieKeywords 
};
