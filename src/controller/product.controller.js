
const db = require("../utile/db");
const fs = require('fs');
const path = require('path');

// Get product
exports.GetCategory = (req, res) => {
  const query = 'SELECT * FROM product';
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

// create product
exports.Createproduct = (req, res) => {
  const { names,expice,category_id,qty,original_price,sale_price,profit,discount,status,userNote,discription } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = 'INSERT INTO product (names,expice,category_id,qty,original_price,sale_price,profit,discount,status,image,userNote,discription) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(query, [names,expice,category_id,qty,original_price,sale_price,profit,discount,status,image,userNote,discription], (err, result) => {
    if (err) {
      return res.status(500).send('Error creating category');
    }
    res.status(201).json(result);
  });
};



// Get categories
exports.getCategorySingle = (req, res) => {
  const id  = req.params.id;
  const query = 'SELECT pro.*,pro.id as proid FROM product as pro inner join categories as cat on  pro.category_id = cat.id where pro.category_id=?';
  db.query(query,[id], (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching categories');
    }
    res.json(result);
  });
};


// Update category
exports.Updateproduct = (req, res) => {
  const { id } = req.params;
  const {  names,expice,category_id,qty,original_price,sale_price,profit,discount,status,userNote ,discription} = req.body;
  let newImage = req.file ? req.file.filename : null;

  // Query to get the old image
  db.query('SELECT image FROM product WHERE id = ?', [id], (err, result) => {
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
          db.query('UPDATE product SET names = ?,expice=?,category_id=?,qty=?,original_price=?,sale_price=?,profit=?,discount=?,status=?,image=?,userUpdate=?,discription=? WHERE id = ?', [names,expice,category_id,qty,original_price,sale_price,profit,discount,status,newImage,userNote,discription, id], (err, result) => {
              if (err) {
                  return res.status(500).send('Error updating category');
              }
              res.json(result);
          });
      } else {
          // If no new image is provided, use the old image
          db.query('UPDATE UPDATE product SET names = ?,expice=?,category_id=?,qty=?,original_price=?,sale_price=?,profit=?,discount=?,status=?,image=?,userUpdate=?,discription=? WHERE id = ?', [names,expice,category_id,qty,original_price,sale_price,profit,discount,status,oldImage,userNote,discription, id], (err, result) => {
              if (err) {
                  return res.status(500).send('Error updating category');
              }
              res.json(result);
          });
      }
  });
};

// Delete product
exports.Deleteproduct = (req, res) => {
  const { id } = req.params;

  // Delete the image file associated with the category
  db.query('SELECT image FROM product WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send('Error fetching image');
    const image = result[0].image;
    if (image) {
      fs.unlink(path.join(__dirname, '../public/image', image), err => {
        if (err) console.log('Failed to delete image:', err);
      });
    }
  });

  const query = 'DELETE FROM product WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting category');
    }
    res.json(result);
  });
};
