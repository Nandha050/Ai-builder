const app = require('./app');

// Connect Database
const connectDB = require('./config/db');
require('dotenv').config();

// Connect Database


connectDB()
.then(  () => { console.log('Database connected successfully');
 const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 })
 .catch((err) => {
  console.error('Database connection failed:', err);
 });

