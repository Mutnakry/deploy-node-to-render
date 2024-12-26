
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const db = require('./src/utile/db'); // Your database utility file
const app = express();
const path = require('path');
const port = 6700;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to handle CORS


// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Import and use the category routes
const categoryRoutes = require('./src/route/category.route');
app.use('/api/categories', categoryRoutes); 
// get image static files show in front end
app.use('/image', express.static(path.join(__dirname, './src/public/image')));

// Import and use the category routes
const ProductRoutes = require('./src/route/product.router');
app.use('/api/product', ProductRoutes); 

// Import and use the authentication routes
const authRoutes = require('./src/route/authRoute');
app.use('/api/auth', authRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
