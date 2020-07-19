const User = require('../models/user')
const postControllers = {}

postControllers.create = (req,res) => {
    const url = req.protocol + '://' + req.get('host')
    const img = req.file
    let path = ''
    if(img){
        path = url + img.path.replace('uploads', '')
    }
    // const io = req.app.io
    const {body} = req
    console.log(path, req.body.post, req.body.postType)
    let dataPack = {
        createdBy: req.user._id,
        postByMe: true,
        postType: body.postType,
        post: body.post,
        uploadPath: path,
    }
    User.findOneAndUpdate({_id: req.user._id},{
        $push: {
            posts: {
                $each: [dataPack],
                $position: 0
            }
        }
    },{new: true, select: 'posts'})
        .populate('posts.createdBy', 'username profilePicUrl')
        .then(user => {
            res.json(user)
        }).catch(err => res.json(err))
}

module.exports = postControllers