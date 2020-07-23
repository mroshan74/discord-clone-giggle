const User = require('../models/user')
const { Post } = require('../models/post')
const Socket = require('../models/socket')
const postControllers = {}

postControllers.listPublicPosts = (req,res) => {
    Post.find({}).sort({createdAt: 'desc'})
        .populate('createdBy','username profilePicUrl')
        .then(posts => {
            res.json(posts)
        }).catch(err => res.json(err))
}

postControllers.create = (req,res) => {
    const url = req.protocol + '://' + req.get('host')
    const img = req.file
    let path = ''
    if(img){
        path = url + img.path.replace('uploads', '')
    }
    const io = req.app.io
    const {body} = req
    console.log(path, req.body.post, req.body.postType)
    let dataPack = {
        createdBy: req.user._id,
        postType: body.postType,
        post: body.post,
        uploadPath: path,
    }
    if(body.postType === 'Private'){
        dataPack.postByMe = true
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
                res.json(user.posts[0])
            }).catch(err => res.json(err))
    }
    else if(body.postType === 'Public'){
        const post = new Post(dataPack)
        post.save()
            .then(post => {
                dataPack.publicPostId = post._id
                dataPack.postByMe = true
                User.findOneAndUpdate({_id: req.user._id},{
                    $push: { posts: {
                        $each: [dataPack],
                        $position: 0
                    }}
                },{new: true, select: 'posts'})
                .populate('posts.createdBy', 'username profilePicUrl')
                .then(user => {
                    io.emit('publicPost',user.posts[0])
                    res.json(user.posts[0])
                }).catch(err => res.json(err))
            }).catch(err => res.json(err))
    }
    else if(body.postType === 'Friends'){
        dataPack.postByMe = true
        User.findOneAndUpdate({_id: req.user._id},{
            $push: {
                posts: {
                    $each: [dataPack],
                    $position: 0
                }
            }
        },{new: true, select: 'friends posts'})
            .populate('posts.createdBy', 'username profilePicUrl')
            .then(user => {
                //console.log('[POST[0] ---> friends]',user.posts[0])
                // User.updateMany({'friends.info': req.user._id},{
                //     $push: {
                //         posts: {
                //             $each: [user.posts[0]],
                //             $position: 0
                //         }
                //     }
                // })
                user.posts[0].postByMe = false
                user.posts[0].friendPostId = user.posts[0]._id
                user.friends.map(friend => {
                    //console.log(friend.info)
                    User.findOneAndUpdate({_id: friend.info},{
                        $push: {
                            posts: {
                                $each: [user.posts[0]],
                                $position: 0
                            }
                        }
                    },{new: true, select: 'posts'})
                    .populate('posts.createdBy','username profilePicUrl')
                    .then(user => {
                            //console.log('updated friend post', user)
                            Socket.findOne({_id: user._id})
                                .then(getUserSocketId => {
                                    if(getUserSocketId){
                                        const { socketId } = getUserSocketId
                                        io.to(socketId).emit('addNewFriendPost',user.posts[0])
                                    }
                                })
                        })
                    .catch(err => res.json(err))
                })
                res.json(user.posts[0])
            }).catch(err => res.json(err))
    }
}

postControllers.destroy = (req,res) => {
    const id = req.params.id
    const postType = req.params.postType
    if(postType === 'Private'){
        User.findOneAndUpdate({_id: req.user._id},{
            $pull: {
                posts: {
                    _id: id
                }
            }
        },{new:true, select: 'posts'})
        .populate('posts.createdBy', 'username profilePicUrl')
        .then(user => {
            //console.log(user.posts,'[pr post deleted]')
            res.json(user.posts)
        })
        .catch(err => console.log(err))
    }
    else if(postType === 'Public'){
        Post.findOneAndRemove({_id: id})
        .then(post => {
            //console.log(post,'[public post deleted]')
        }).catch(err => console.log(err))

        User.findOneAndUpdate({_id:req.user._id},{
            $pull: {
                posts: {
                    publicPostId: id
                }
            }
        },{new:true, select: 'posts'})
        .populate('posts.createdBy', 'username profilePicUrl')
        .then(user => {
            //console.log(user.posts,'[public post deleted from user posts]')
            res.json(user.posts)
        }).catch(err => console.log(err))
    }
    else if(postType === 'Friends') {
        User.findOneAndUpdate({_id: req.user._id},{
            $pull: {
                posts: {
                    _id: id
                }
            }
        },{new: true, select: 'friends posts'})
            .populate('posts.createdBy', 'username profilePicUrl')
            .then(user => {
                user.friends.map(friend => {
                    User.findOneAndUpdate({_id: friend.info},{
                        $pull: {
                            posts: {
                                friendPostId: id
                            }
                        }
                    },{new: true, select: 'posts username profilePicUrl'})
                    .then(user => {
                        //console.log('deleted friend post', user)
                    }).catch(err => res.json(err))
                })
                res.json(user.posts)
            }).catch(err => res.json(err))
    }
}

postControllers.postAction = (req,res) => {
    const actionType = req.params.action
    const id = req.params.id
    const postType = req.params.postType

    console.log(actionType,id,postType,'------------------->postAction')

    if(postType === 'Public'){
        Post.findOne({_id: id}, 'isLiked isDisliked')
            .then(result => {
                if(actionType === 'like'){
                    if(result.isLiked.length){
                        if(result.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id: id}, {
                                $push: {
                                    isLiked: req.user._id
                                },
                                $pull: { 
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isLiked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                        else if(result.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id: id}, {
                                $pull: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                        else{
                            Post.findOneAndUpdate({_id: id}, {
                                $push: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                    }
                    else {
                        Post.findOneAndUpdate({_id: id}, {
                            $push: {
                                isLiked: req.user._id
                            }
                        },{new: true, select: 'isLiked'})
                        .then(result => {
                            res.json(result)
                        }).catch(err => res.json(err))
                    }
                }

                else if(actionType==='dislike'){
                    if(result.isDisliked.length){
                        if(result.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id: id}, {
                                $push: {
                                    isDisliked: req.user._id
                                },
                                $pull: { 
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isDisliked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                        else if(result.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id: id}, {
                                $pull: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isDisliked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                        else{
                            Post.findOneAndUpdate({_id: id}, {
                                $push: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isDisliked'})
                            .then(result => {
                                res.json(result)
                            }).catch(err => res.json(err))
                        }
                    }
                    else {
                        Post.findOneAndUpdate({_id: id}, {
                            $push: {
                                isDisliked: req.user._id
                            }
                        },{new: true, select: 'isDisliked'})
                        .then(result => {
                            res.json(result)
                        }).catch(err => res.json(err))
                    }
                }
            })
    }
}

module.exports = postControllers