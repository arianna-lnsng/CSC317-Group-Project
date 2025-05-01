/**
 *  Module to run importFilms.js to add initial selection of movies
 */

require('dotenv').config();
const mongoose = require('mongoose');
const importFilm = require('../importFilm'); // ✅ Confirm correct path

console.log('📂 Using importFilm from:', require.resolve('../importFilm'));

/**
 * @type {string[]} List of movie titles to import via TMDb
 */
const filmTitles = [
  'The Dark Knight',
  'Fight Club',
  'Forrest Gump',
  'The Matrix',
  'Interstellar',
  'Parasite',
  'The Lord of the Rings: The Fellowship of the Ring',
  'The Lord of the Rings: The Two Towers',
  'The Lord of the Rings: The Return of the King',
  'Whiplash',
  'Gladiator',
  'The Social Network',
  'The Departed',
  'The Prestige',
  'Django Unchained',
  'The Silence of the Lambs',
  'The Green Mile',
  'Schindler\'s List',
  'Goodfellas',
  'No Country for Old Men'
];

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    for (const title of filmTitles) {
      console.log(`🎬 Importing "${title}"...`);
      try {
        const result = await importFilm(title);
        console.log(`✅ Imported: ${result.name}`);
      } catch (err) {
        console.warn(`⚠️ Failed to import "${title}": ${err.message}`);
      }
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  }
})();
