const express = require('express')
const productController = require('../controller/productController')
const multer = require('multer')
const path = require('path')
const router = express.Router()


// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/') // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)) // Rename file with timestamp to avoid collisions
    },
  })

const upload = multer({ storage: storage })


router.post('/create', upload.single('image'), productController.addProduct)
router.get('/showAllProduct', productController.showAllProduct)
router.get('/showOnlyOneProduct/:id', productController.showSpecificProduct)
router.put('/updateProduct/:id', upload.single('image'), productController.updateProduct)
router.delete('/deleteProduct/:id', productController.deleteProduct)

module.exports = router