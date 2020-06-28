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
  //console.log(req.body.message)

  const friendId = req.params.id
  const { message } = req.body
  //console.log(friendId, message ,'SEND MESSAGE----------------')
  //!receivers database
  User.findOneAndUpdate({_id: friendId, 'friends.info': req.user._id, 'friends.status':'Accepted'},{
    $push: {
      'friends.$.inbox': { message }
    }
  },{new: true})
    .then(user => {
      if(user){
        const packData = {
          _id: req.user._id,
          inbox: user.friends[0].inbox.slice(-1).pop()
        }
        Socket.findOne({_id: friendId})
            .then(getUserSocket => {
              if(getUserSocket){
                const { socketId } = getUserSocket
                io.to(socketId).emit('server message listening',{...packData})
              }
            })
            .catch(err => console.log(err))
      }
      else{
        res.json({
          errors: 'invalid action',
          message: 'No access authorization',
        })
      }
    })
    .catch(err => res.json(err))


  //! sender database
  User.findOneAndUpdate({ _id: req.user._id, 'friends.info': friendId, 'friends.status':'Accepted' },{
    $push: {
        'friends.$.inbox': {
            message,
            isMyMessage: true
        }
    }
  },{new: true , select: 'friends.info friends.inbox'})
    .then(user => {
      if(user){
        const packData = {
          _id: friendId,
          inbox: user.friends[0].inbox.slice(-1).pop()
        }
        //console.log(packData, 'PACKDATA++++++')
        res.json(packData)
      }else{
        res.json({
          errors: 'invalid action',
          message: 'No access authorization'
        })
      }
    }).catch(err => res.json(err))


  // res.json({
  //   errors: 'testing api',
  //   message: 'socket.io test run'
  // })
}

// upload a file
chatControllers.fileUpload = (req, res) => {
  const url = req.protocol + '://' + req.get('host')
  //console.log(url, req.get('host'))
  //console.log(req.file)
  const img = req.file
  const path = url + img.path.replace('uploads', '')
  //console.log(path)
  res.json(path)
}

module.exports = chatControllers
