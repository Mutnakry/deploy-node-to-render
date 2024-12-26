
const db = require("../utile/db");
const fs = require('fs');
const path = require('path');

// Get categories
exports.GetCategory = (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching categories');
    }
    res.json(result);
  });
};

// Get categories with pagination and search
// exports.Paginate = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const searchQuery = req.query.search_query || "";
//   const offset = (page - 1) * limit;

//   const countQuery = 'SELECT COUNT(*) AS total FROM categories WHERE names LIKE ? OR detail LIKE ?';
//   db.query(countQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
//     if (err) throw err;
//     const totalCategory = results[0].total;
//     const totalPages = Math.ceil(totalCategory / limit);

//     const selectQuery = 'SELECT * FROM categories WHERE names LIKE ? OR detail LIKE ? LIMIT ? OFFSET ?';
//     db.query(selectQuery, [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset], (err, results) => {
//       if (err) throw err;
//       res.json({
//         categories: results,
//         totalPages,
//         currentPage: page,
//         totalCategory,
//       });
//     });
//   });
// };

// Register category
exports.CreateCategory = (req, res) => {
  const { names, userNote } = req.body;
  const image = req.file.filename;

  const query = 'INSERT INTO categories (names,image,userNote) VALUES (?,?,?)';
  db.query(query, [names, image, userNote], (err, result) => {
    if (err) {
      return res.status(500).send('Error creating category');
    }
    res.status(201).json(result);
  });
};

//// Get categories
// exports.getCategorySingle = (req, res) => {
//   const id  = req.params.id;
//   const query = 'SELECT * FROM categories where id=?';
//   db.query(query,[id], (err, result) => {
//     if (err) {
//       return res.status(500).send('Error fetching categories');
//     }
//     res.json(result[0]);
//   });
// };


// Update category
exports.UpdateCategory = (req, res) => {
  const { id } = req.params;
  const { names, userNote } = req.body;
  let newImage = req.file ? req.file.filename : null;

  // Query to get the old image
  db.query('SELECT image FROM categories WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).send('Error fetching old image');
      const oldImage = result[0].image;

      // If a new image is provided
      if (newImage) {
          // Delete the old image file
          if (oldImage) {
              fs.unlink(path.join(__dirname, '../public/image', oldImage), err => {
                  if (err) console.log('Failed to delete old image:', err);
              });
          }
          // Update the category with the new image
          db.query('UPDATE categories SET names = ?,image = ?, userUpdate = ? WHERE id = ?', [names, newImage, userNote, id], (err, result) => {
              if (err) {
                  return res.status(500).send('Error updating category');
              }
              res.json(result);
          });
      } else {
          // If no new image is provided, use the old image
          db.query('UPDATE categories SET names = ?, image = ?, userUpdate = ? WHERE id = ?', [names, oldImage, userNote, id], (err, result) => {
              if (err) {
                  return res.status(500).send('Error updating category');
              }
              res.json(result);
          });
      }
  });
};

// Delete category
exports.DeleteCategory = (req, res) => {
  const { id } = req.params;

  // Delete the image file associated with the category
  db.query('SELECT image FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send('Error fetching image');
    const image = result[0].image;
    if (image) {
      fs.unlink(path.join(__dirname, '../public/image', image), err => {
        if (err) console.log('Failed to delete image:', err);
      });
    }
  });

  const query = 'DELETE FROM categories WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting category');
    }
    res.json(result);
  });
};
