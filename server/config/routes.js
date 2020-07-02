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

router.post('/users/register',userControllers.register)
router.post('/users/login',userControllers.login)
router.get('/users/account',authenticateUser, userControllers.account)

router.get('/users/chats', authenticateUser,chatControllers.list)
router.post('/users/upload', authenticateUser, upload.single('file'), chatControllers.fileUpload)

router.post('/users/search',authenticateUser ,userControllers.search)
//router.get('/users/friendList',authenticateUser ,userControllers.friendList)
router.post('/users/sendRequest/:id',authenticateUser ,userControllers.sendRequest)
router.post('/users/cancelRequest/:id',authenticateUser ,userControllers.cancelRequest)
router.post('/users/acceptRequest/:id',authenticateUser ,userControllers.acceptRequest)
router.post('/users/rejectRequest/:id',authenticateUser ,userControllers.rejectRequest)
router.post('/users/removeFriend/:id',authenticateUser ,userControllers.removeFriend)

router.get('/users/getChats/:id',authenticateUser,chatControllers.list)
router.post('/users/sendMsg/:id',authenticateUser,chatControllers.sendMsg)


module.exports = router