// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const {
//   DeleteCategory,
//   CreateCategory,
//   UpdateCategory,
//   GetCategory,
//   Paginate,
//   getCategorySingle
// } = require('../controller/category.controller');


// const router = express.Router();

// // Set up storage engine for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, '../public/image');
//     cb(null, path.join(__dirname, '../public/image')); // Corrected path

//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   }
// });
// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// // Initialize upload
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// });

// router.get('/', GetCategory);
// router.post('/', upload.single('file'), CreateCategory);
// // router.get('/paginate', Paginate);
// // router.get('/:id', getCategorySingle);
// router.put('/:id', upload.single('file'), UpdateCategory);
// router.delete('/:id', DeleteCategory);

// module.exports = router;




const express = require('express');
const db = require('../utile/db');
const router = express.Router();

router.get('/', (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);  // Log error
            res.status(500).json({ error: "Error fetching categories" });
        } else {
            console.log("Categories fetched successfully:", results);  // Log success
            res.json(results);
        }
    });
});

module.exports = router;
