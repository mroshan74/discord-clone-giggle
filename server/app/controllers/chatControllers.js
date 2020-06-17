const Chat = require('../models/chat')
const chatControllers = {}

chatControllers.list = (req, res) => {
  //const id = req.user._id
  Chat.find()
    .populate('sender')
    .then((chats) => res.json(chats))
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
  res.json(path)
}

module.exports = chatControllers
