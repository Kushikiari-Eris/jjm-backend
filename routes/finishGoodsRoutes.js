const finishGoodsController = require('../controller/finishGoodsController')
const express = require('express')
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


router.post('/finishGoods', upload.single('image'), finishGoodsController.addFinishProduct)
router.get('/finishGoods', finishGoodsController.showAllFinishProducts)
router.get('/finishGoods', finishGoodsController.lowOnStockAlerts)
router.put('/finishGoods/:id', upload.single('image'), finishGoodsController.editFinishProduct)
router.put('/finishGoods/:id/decrementStock', finishGoodsController.decrementStock)
router.patch('/finishGoods/:id/launchStatus', finishGoodsController.editLaunchStatus)
router.get('/finishGoods/:id', finishGoodsController.showAllFinishProducts)
router.delete('/finishGoods/:id', finishGoodsController.deleteFinishProduct)

module.exports = router