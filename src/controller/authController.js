const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utile/db'); // Import your database utility

// Register user
// exports.register = async (req, res) => {
//   try {
//     const { names, phone, pass, rol } = req.body;
//     const hashedPassword = await bcrypt.hash(pass, 8);
//     const query = 'INSERT INTO user (names, phone, pass, rol) VALUES (?, ?, ?, ?)';
//     await db.query(query, [names, phone, hashedPassword, rol]);
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     res.status(500).send('Error registering user');
//   }
// };
exports.register =async (req, res) => {
  try {

      const { names, phone, pass, rol } = req.body; 
      const phoneCheckQuery = 'SELECT phone FROM user WHERE phone = ?';
      db.query(phoneCheckQuery, [phone], async (err, results) => {
          if (err) {
              return res.status(500).send('Error checking phone');
          }
          if (results.length > 0) {
              return res.status(400).send('phone already in use');
          }

      const hashedPassword = await bcrypt.hash(pass, 8);
      const query = 'INSERT INTO user (names, phone, pass, rol) VALUES (?, ?, ?, ?)'; 

      db.query(query, [names, phone, hashedPassword, rol], (err, results) => {
          if (err) {
              return res.status(500).send('Error registering manager'); 
          }
          res.status(201).send('manager registered successfully'); 
      });
    });
  } catch (error) {
      res.status(500).send('Error registering manager');
  }
};





// Login user
exports.login = (req, res) => {
  const { phone, pass } = req.body;

  // SQL query to find the user by phone
  const query = 'SELECT * FROM user WHERE phone = ?';
  
  // Execute the query with the provided phone
  db.query(query, [phone], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    // Compare the provided password with the hashed password
    const isPasswordValid = bcrypt.compareSync(pass, user.pass);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, rol: user.rol }, 'your_jwt_secret', { expiresIn: 86400 }); // 24 hours

    // Respond with the token and user details
    res.status(200).send({ auth: true, token, rol: user.rol, names: user.names,phone: user.phone });
  });
};

// Middleware to check if the user is authenticated
exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.headers['authorization'];
  if (!token) return res.status(403).send('No token provided.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Failed to authenticate token.');
    req.userId = decoded.id;
    req.userRole = decoded.rol;
    next();
  });
};
