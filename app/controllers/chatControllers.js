const User = require('../models/user')
const Socket = require('../models/socket')

const chatControllers = {}

chatControllers.list = (req, res) => {
  const friendId = req.params.id
  User.findOne({ _id: req.user._id, 'friends.info': friendId, 'friends.status':'Accepted' }, 'friends.info friends.inbox')
    .populate('friends.info', 'username profilePicUrl')
    .populate('friends.inbox.sender', 'username profilePicUrl')
    .then((chats) => res.json(chats))
    .catch((err) => res.json(err))
}

chatControllers.sendMsg = (req,res) => {
  const io = req.app.io
  console.log(req.body.message)

  const friendId = req.params.id
  const { message } = req.body
  //console.log(friendId, message ,'SEND MESSAGE----------------')
  //!receivers database
  User.findOneAndUpdate(
    {
      _id: friendId,
      'friends.info': req.user._id,
      friends: { $elemMatch: { status: 'Accepted' } },
    },
    {
      $push: {
        'friends.$.inbox': { message },
      },
    },
    { new: true, select: 'friends.info friends.inbox' }
  )
    .then((user) => {
      if (user) {
        //console.log(user)

        const getUpdatedFriend = user.friends.find(friend => JSON.stringify(friend.info) === JSON.stringify(req.user._id))
        //console.log('getUpdatedFriend', getUpdatedFriend, req.user._id)
        
        const packData = {
          _id: req.user._id,
          inbox: getUpdatedFriend.inbox.slice(-1).pop(),
        }
        console.log('packData[RECEIVER] ----->',packData)

        Socket.findOne({_id: friendId})
            .then(getUserSocket => {
              if(getUserSocket){
                const { socketId } = getUserSocket
                io.to(socketId).emit('server message listening',{...packData})
              }
            })
            .catch(err => console.log(err))
      } else {
        res.json({
          errors: 'invalid action',
          message: 'No access authorization',
        })
      }
    })
    .catch((err) => res.json(err))


  //! sender database
  User.findOneAndUpdate(
    {
      _id: req.user._id,
      'friends.info': friendId,
      friends: { $elemMatch: { status: 'Accepted' } },
      //friends: { $elemMatch: { info: friendId } },
    },
    {
      $push: {
        'friends.$.inbox': {
          message,
          isMyMessage: true,
        }
      }
    },
    { new: true, select: 'friends.info friends.inbox' }
  )
    .then((user) => {
      if (user) {
        //console.log(user)
        const getUpdatedFriend = user.friends.find(friend => JSON.stringify(friend.info) === JSON.stringify(friendId))
        //console.log('getUpdatedFriend',getUpdatedFriend,friendId)
        
        const packData = {
          _id: friendId,
          inbox: getUpdatedFriend.inbox.slice(-1).pop()
        }
        console.log('packData[SENDER] ----->',packData)
        res.json(packData)
      } else {
        res.json({
          errors: 'invalid action',
          message: 'No access authorization',
        })
      }
    })
    .catch((err) => res.json(err))
}

// upload a file
chatControllers.fileUpload = (req, res) => {
  const url = req.protocol + '://' + req.get('host')
  //console.log(url, req.get('host'))
  //console.log(req.file)
  const img = req.file
  const path = url + img.path.replace('uploads', '')
  //console.log(path)

  const io = req.app.io

  const friendId = req.params.id
  const { type } = req.body
  //console.log(friendId, message ,'SEND MESSAGE----------------')

  //!receivers database
  User.findOneAndUpdate(
    {
      _id: friendId,
      'friends.info': req.user._id,
      friends: { $elemMatch: { status: 'Accepted' } },
    },
    {
      $push: {
        'friends.$.inbox': { message: path, type},
      },
    },
    { new: true, select: 'friends.info friends.inbox' }
  )
    .then((user) => {
      if (user) {
        console.log(user)

        const getUpdatedFriend = user.friends.find(
          (friend) =>
            JSON.stringify(friend.info) === JSON.stringify(req.user._id)
        )
        //console.log('getUpdatedFriend', getUpdatedFriend, req.user._id)

        const packData = {
          _id: req.user._id,
          inbox: getUpdatedFriend.inbox.slice(-1).pop(),
        }
        console.log('packData[RECEIVER] ----->', packData)

        Socket.findOne({ _id: friendId })
          .then((getUserSocket) => {
            if (getUserSocket) {
              const { socketId } = getUserSocket
              io.to(socketId).emit('server message listening', { ...packData })
            }
          })
          .catch((err) => console.log(err))
      } else {
        res.json({
          errors: 'invalid action',
          message: 'No access authorization',
        })
      }
    })
    .catch((err) => res.json(err))

  //! sender database
  User.findOneAndUpdate(
    {
      _id: req.user._id,
      'friends.info': friendId,
      friends: { $elemMatch: { status: 'Accepted' } },
      //friends: { $elemMatch: { info: friendId } },
    },
    {
      $push: {
        'friends.$.inbox': {
          message: path,
          isMyMessage: true,
          type
        },
      },
    },
    { new: true, select: 'friends.info friends.inbox' }
  )
    .then((user) => {
      if (user) {
        //console.log(user)
        const getUpdatedFriend = user.friends.find(
          (friend) => JSON.stringify(friend.info) === JSON.stringify(friendId)
        )
        //console.log('getUpdatedFriend',getUpdatedFriend,friendId)

        const packData = {
          _id: friendId,
          inbox: getUpdatedFriend.inbox.slice(-1).pop(),
        }
        console.log('packData[SENDER] ----->', packData)
        res.json(packData)
      } else {
        res.json({
          errors: 'invalid action',
          message: 'No access authorization',
        })
      }
    })
    .catch((err) => res.json(err))
}

module.exports = chatControllers
