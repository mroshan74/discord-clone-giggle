const express = require('express')
const router = express.Router()
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname.replace(/\s+/g, ""))
  },
})
var upload = multer({ storage: storage })

const userControllers = require('../app/controllers/userControllers')
const chatControllers = require('../app/controllers/chatControllers')
const { authenticateUser } = require('../app/middlewares/authentication')

router.post('/user/register',userControllers.register)
router.post('/user/login',userControllers.login)
router.get('/user/account',authenticateUser, userControllers.account)

router.get('/user/chats', authenticateUser,chatControllers.list)
router.post('/user/upload', authenticateUser, upload.single('file'), chatControllers.fileUpload)

router.post('/user/search',authenticateUser ,userControllers.search)
router.post('/user/sendRequest/:id',authenticateUser ,userControllers.sendRequest)
router.post('/user/cancelRequest/:id',authenticateUser ,userControllers.cancelRequest)
router.post('/user/acceptRequest/:id',authenticateUser ,userControllers.acceptRequest)
router.post('/user/rejectRequest/:id',authenticateUser ,userControllers.rejectRequest)
router.post('/user/removeFriend/:id',authenticateUser ,userControllers.removeFriend)

module.exports = router