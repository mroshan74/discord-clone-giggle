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
router.post('/user/sendrequest/:id',authenticateUser ,userControllers.sendRequest)
router.post('/user/cancelrequest/:id',authenticateUser ,userControllers.cancelRequest)

module.exports = router