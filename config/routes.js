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
const searchControllers = require('../app/controllers/searchControllers')
const friendsControllers = require('../app/controllers/friendsControllers')
const chatControllers = require('../app/controllers/chatControllers')
const postControllers = require('../app/controllers/postControllers')
const { authenticateUser } = require('../app/middlewares/authentication')

//! accounts
router.post('/users/register',userControllers.register)
router.post('/users/login',userControllers.login)
router.get('/users/account',authenticateUser, userControllers.account)

//! search
router.post('/users/search',authenticateUser ,searchControllers.search)
router.post('/users/search/sendRequest/:id',authenticateUser ,searchControllers.sendRequest)
router.post('/users/search/cancelRequest/:id',authenticateUser ,searchControllers.cancelRequest)
router.post('/users/search/acceptRequest/:id',authenticateUser ,searchControllers.acceptRequest)
router.post('/users/search/rejectRequest/:id',authenticateUser ,searchControllers.rejectRequest)
router.post('/users/search/removeFriend/:id',authenticateUser ,searchControllers.removeFriend)

//! friends
//router.post('/users/friends/sendRequest/:id',authenticateUser ,friendsControllers.sendRequest)
router.get('/users/friendList',authenticateUser ,friendsControllers.friendList)
router.post('/users/friends/cancelRequest/:id',authenticateUser ,friendsControllers.cancelRequest)
router.post('/users/friends/acceptRequest/:friendName/:id',authenticateUser ,friendsControllers.acceptRequest)
router.post('/users/friends/rejectRequest/:id',authenticateUser ,friendsControllers.rejectRequest)
router.post('/users/friends/removeFriend/:id',authenticateUser ,friendsControllers.removeFriend)


//! chat
router.get('/users/chats', authenticateUser,chatControllers.list)
router.get('/users/getChats/:id',authenticateUser,chatControllers.list)
router.post('/users/sendMsg/:id',authenticateUser,chatControllers.sendMsg)
router.post('/users/chats/upload/:id', authenticateUser, upload.single('file'), chatControllers.fileUpload)

//! posts
router.get('/users/getLatestPublicPosts', postControllers.listPublicPosts)
router.get('/users/getUserPosts', authenticateUser, postControllers.listUserPosts)
router.get('/users/getLatestFriendPosts', authenticateUser, postControllers.listFriendPosts)
router.post('/users/posts/new', authenticateUser, upload.single('file'),postControllers.create)
router.put('/users/posts/update/:id', authenticateUser, upload.single('file'), postControllers.update)
router.delete('/users/posts/:id', authenticateUser,postControllers.destroy)
router.put('/users/posts/action/:action/:id', authenticateUser,postControllers.postAction)

module.exports = router