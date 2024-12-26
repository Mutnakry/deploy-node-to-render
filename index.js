
// const express = require('express');
// const cors = require('cors');
// const db = require('./src/utile/db');
// const app = express();
// const path = require('path');
// const port = 6700;
// require('dotenv').config();


// app.use(express.json()); // Middleware to parse JSON bodies
// app.use(cors()); // Middleware to handle CORS


// // Connect to the database
// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the MySQL database.');
// });

// // Import and use the category routes
// const categoryRoutes = require('./src/route/category.route');
// app.use('/api/categories', categoryRoutes); 
// // get image static files show in front end
// app.use('/image', express.static(path.join(__dirname, './src/public/image')));

// // Import and use the category routes
// const ProductRoutes = require('./src/route/product.router');
// app.use('/api/product', ProductRoutes); 

// // Import and use the authentication routes
// const authRoutes = require('./src/route/authRoute');
// app.use('/api/auth', authRoutes);


// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });




const express = require('express');
const cors = require('cors');
const db = require('./src/utile/db'); // Database connection is already initialized in db.js
const app = express();
const path = require('path');
const port = 6700;
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Import and use the category routes
const categoryRoutes = require('./src/route/category.route');
app.use('/api/categories', categoryRoutes); 
app.use('/image', express.static(path.join(__dirname, './src/public/image')));

const ProductRoutes = require('./src/route/product.router');
app.use('/api/product', ProductRoutes); 

const authRoutes = require('./src/route/authRoute');
app.use('/api/auth', authRoutes);

app.get('/api/pro', (req, res) => {
    db.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Log the error
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!results.length) {
            console.log('No products found.');
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(results);
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Access the API at http://localhost:${port}/api/product`);
});

