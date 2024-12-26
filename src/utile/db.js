const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "app_game",
    port: process.env.DB_PORT || 3306,
    dateStrings: true
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit process if database connection fails
    }
    console.log("Connected to the MySQL database.");
});

module.exports = db;
