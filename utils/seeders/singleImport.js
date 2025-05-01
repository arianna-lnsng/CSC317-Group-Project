// Module to import single title using importFilm.js

require('dotenv').config();
const mongoose = require('mongoose');
const importFilm = require('../importFilm'); 

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const filmTitle = 'Barbie';  // Adds the movie here to the database
    console.log(`🎬 Importing movie: ${filmTitle}`);

    const result = await importFilm(filmTitle);
    console.log('✅ Movie imported successfully:', result.name);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
    process.exit(1);
  }
})();
