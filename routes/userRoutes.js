const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()

router.post('/register', userController.Register)
router.post('/login', userController.Login)
router.get('/logout', userController.Logout)
router.get('/loggedIn', userController.LoggedIn)
router.get('/users', userController.showAllUsers)
router.put('/users/:id', userController.editUser)

module.exports = router