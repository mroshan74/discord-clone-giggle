const User = require('../models/user')
const { Post } = require('../models/post')
//const { FriendPost } = require('../models/friendPost')
const Socket = require('../models/socket')
const postControllers = {}

postControllers.listUserPosts = (req,res) => {
    Post.find({createdBy: req.user._id}).sort({createdAt: 'desc'})
        .populate('createdBy','username profilePicUrl')
        .then(posts => {
            res.json(posts)
        }).catch(err => res.json(err))
}

postControllers.listPublicPosts = (req,res) => {
    Post.find({postType: 'Public'}).sort({createdAt: 'desc'})
        .populate('createdBy','username profilePicUrl')
        .then(posts => {
            res.json(posts)
        }).catch(err => res.json(err))
}

postControllers.listFriendPosts = (req,res) => {
    Post.find({friendsTo: req.user._id, postType: 'Friends'}).sort({createdAt: 'desc'})
        .populate('createdBy','username profilePicUrl')
        .then(posts => {
            res.json(posts)
        }).catch(err => res.json(err))
}

postControllers.create = async(req,res) => {
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
        // dataPack.postByMe = true
        // User.findOneAndUpdate({_id: req.user._id},{
        //     $push: {
        //         posts: {
        //             $each: [dataPack],
        //             $position: 0
        //         }
        //     }
        // },{new: true, select: 'posts'})
        //     .populate('posts.createdBy', 'username profilePicUrl')
        //     .then(user => {
        //         res.json(user.posts[0])
        //     }).catch(err => res.json(err))
        const post = new Post(dataPack)
        post.save()
            .then(post => {
                post.populate('createdBy', 'username profilePicUrl').execPopulate()
                .then(populated => {
                    res.json(populated)
                }).catch(err => res.json(err))
            }).catch(err => res.json(err))

    }
    else if(body.postType === 'Public'){
        const post = new Post(dataPack)
        post.save()
            .then(post => {
                // dataPack.publicPostId = post._id
                // dataPack.postByMe = true
                // User.findOneAndUpdate({_id: req.user._id},{
                //     $push: { posts: {
                //         $each: [dataPack],
                //         $position: 0
                //     }}
                // },{new: true, select: 'posts'})
                post.populate('createdBy', 'username profilePicUrl').execPopulate()
                .then(user => {
                    io.emit('publicPost',post)
                    res.json(post)
                }).catch(err => res.json(err))
            }).catch(err => res.json(err))
    }
    else if(body.postType === 'Friends'){
        await User.findOne({_id: req.user._id},'friends')
            .then(result => {
                let friendIds = result.friends.map(friend => friend.info)
                //console.log(friendIds)
                dataPack.friendsTo = friendIds
            }).catch(err => res.json(err))
        
        const post = new Post(dataPack)
        post.save()
            .then(post => {
                // dataPack.friendPostId = post._id
                // dataPack.postByMe = true
                // User.findOneAndUpdate({_id: req.user._id},{
                //     $push: { posts: {
                //         $each: [dataPack],
                //         $position: 0
                //     }}
                // },{new: true, select: 'posts'})
                post.populate('createdBy', 'username profilePicUrl').execPopulate()
                .then(populated => {
                    dataPack.friendsTo.map(id => {
                        Socket.findOne({_id: id})
                            .then(getUserSocketId => {
                                if(getUserSocketId){
                                    const { socketId } = getUserSocketId
                                    io.to(socketId).emit('addNewFriendPost',populated)
                                }
                            }).catch(err => console.log(err))
                    })
                    res.json(populated)
                }).catch(err => res.json(err))
            }).catch(err => res.json(err))
    }
}

postControllers.destroy = (req,res) => {
    const id = req.params.id
    Post.findOneAndRemove({_id: id})
        .populate('createdBy', 'username profilePicUrl')
        .then(post => {
            res.json(post)
        })
        .catch(err => console.log(err))
    // const postType = req.params.postType
    // if(postType === 'Private'){
    //     User.findOneAndUpdate({_id: req.user._id},{
    //         $pull: {
    //             posts: {
    //                 _id: id
    //             }
    //         }
    //     },{new:true, select: 'posts'})
    //     .populate('posts.createdBy', 'username profilePicUrl')
    //     .then(user => {
    //         //console.log(user.posts,'[pr post deleted]')
    //         res.json(user.posts)
    //     })
    //     .catch(err => console.log(err))
    // }
    // else if(postType === 'Public'){
    //     Post.findOneAndRemove({_id: id})
    //     .then(post => {
    //         //console.log(post,'[public post deleted]')
    //     }).catch(err => console.log(err))

    //     User.findOneAndUpdate({_id:req.user._id},{
    //         $pull: {
    //             posts: {
    //                 publicPostId: id
    //             }
    //         }
    //     },{new:true, select: 'posts'})
    //     .populate('posts.createdBy', 'username profilePicUrl')
    //     .then(user => {
    //         //console.log(user.posts,'[public post deleted from user posts]')
    //         res.json(user.posts)
    //     }).catch(err => console.log(err))
    // }
    // else if(postType === 'Friends') {
    //     // User.findOneAndUpdate({_id: req.user._id},{
    //     //     $pull: {
    //     //         posts: {
    //     //             _id: id
    //     //         }
    //     //     }
    //     // },{new: true, select: 'friends posts'})
    //     //     .populate('posts.createdBy', 'username profilePicUrl')
    //     //     .then(user => {
    //     //         user.friends.map(friend => {
    //     //             User.findOneAndUpdate({_id: friend.info},{
    //     //                 $pull: {
    //     //                     posts: {
    //     //                         friendPostId: id
    //     //                     }
    //     //                 }
    //     //             },{new: true, select: 'posts username profilePicUrl'})
    //     //             .then(user => {
    //     //                 //console.log('deleted friend post', user)
    //     //             }).catch(err => res.json(err))
    //     //         })
    //     //         res.json(user.posts)
    //     //     }).catch(err => res.json(err))

    //     Post.findOneAndRemove({_id: id, postType:'Friends'})
    //     .then(post => {
    //         //console.log(post,'[friend post deleted]')
    //     }).catch(err => console.log(err))

    //     User.findOneAndUpdate({_id:req.user._id},{
    //         $pull: {
    //             posts: {
    //                 friendPostId: id
    //             }
    //         }
    //     },{new:true, select: 'posts'})
    //     .populate('posts.createdBy', 'username profilePicUrl')
    //     .then(user => {
    //         //console.log(user.posts,'[public post deleted from user posts]')
    //         res.json(user.posts)
    //     }).catch(err => console.log(err))
    // }
}

postControllers.postAction = (req,res) => {
    const id = req.params.id
    const actionType = req.params.action
    // const postType = req.params.postType

    // console.log(actionType,id,postType,'------------------->postAction')
    // function updateOriginalPost(packet,to){
    //     console.log(packet,to,'-------------------->packet')
    //     if(postType === 'Public'){
    //         User.findOneAndUpdate({_id: to, 'posts.publicPostId':id},{
    //             $set: {
    //                 'posts.$.isLiked': packet.isLiked,
    //                 'posts.$.isDisliked': packet.isDisliked
    //             }
    //         }).then(result => {
    //             //console.log(result,'------------>public original')
    //         }).catch(err => console.log(err))
    //     }
    //     else if(postType === 'Friends'){
    //         User.findOneAndUpdate({_id: to, 'posts.friendPostId':id},{
    //             $set: {
    //                 'posts.$.isLiked': packet.isLiked,
    //                 'posts.$.isDisliked': packet.isDisliked
    //             }
    //         }).then(result => {
    //             //console.log(result,'------------>friend original')
    //         }).catch(err => console.log(err))
    //     }
    // }

    // if(postType === 'Public' || postType === 'Friends'){
    //     Post.findOne({_id: id}, 'isLiked isDisliked createdBy')
    //         .then(results => {
    //             //console.log(results,actionType)
    //             let { createdBy } = results
    //             switch(actionType){
    //                 case 'like': {
    //                     if(results.isLiked.length){
    //                         if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $pull: {
    //                                     isDisliked: req.user._id
    //                                 },
    //                                 $push: {
    //                                     isLiked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                         else if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                             // console.log('isLiked ------------> liked')
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $pull: {
    //                                     isLiked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                         else {
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $push: {
    //                                     isLiked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                     }
    //                     else{
    //                         if(results.isDisliked.length){
    //                             if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                                 Post.findOneAndUpdate({_id:id},{
    //                                     $pull: {
    //                                         isDisliked: req.user._id
    //                                     },
    //                                     $push: {
    //                                         isLiked: req.user._id
    //                                     }
    //                                 },{new: true, select: 'isLiked isDisliked'})
    //                                 .then(result => {
    //                                     updateOriginalPost(result,createdBy)
    //                                     res.json(result)
    //                                 })
    //                                 .catch(err => res.json(err))
    //                             }
    //                             else {
    //                                 Post.findByIdAndUpdate({_id:id},{
    //                                     $push: {
    //                                         isLiked: req.user._id
    //                                     }
    //                                 },{new: true, select: 'isLiked isDisliked'})
    //                                 .then(result => {
    //                                     updateOriginalPost(result,createdBy)
    //                                     res.json(result)
    //                                 })
    //                                 .catch(err => res.json(err))
    //                             }
    //                         }
    //                         else{
    //                             Post.findByIdAndUpdate({_id:id},{
    //                                 $push: {
    //                                     isLiked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                     }
    //                     break;
    //                 }
    //                 case 'dislike': {
    //                     if(results.isDisliked.length){
    //                         if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $pull: {
    //                                     isLiked: req.user._id
    //                                 },
    //                                 $push: {
    //                                     isDisliked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                         else if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                             // console.log('isLiked ------------> liked')
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $pull: {
    //                                     isDisliked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                         else {
    //                             Post.findOneAndUpdate({_id:id},{
    //                                 $push: {
    //                                     isDisliked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                     }
    //                     else{
    //                         if(results.isLiked.length){
    //                             if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
    //                                 Post.findOneAndUpdate({_id:id},{
    //                                     $pull: {
    //                                         isLiked: req.user._id
    //                                     },
    //                                     $push: {
    //                                         isDisliked: req.user._id
    //                                     }
    //                                 },{new: true, select: 'isLiked isDisliked'})
    //                                 .then(result => {
    //                                     updateOriginalPost(result,createdBy)
    //                                     res.json(result)
    //                                 })
    //                                 .catch(err => res.json(err))
    //                             }
    //                             else {
    //                                 Post.findByIdAndUpdate({_id:id},{
    //                                     $push: {
    //                                         isDisliked: req.user._id
    //                                     }
    //                                 },{new: true, select: 'isLiked isDisliked'})
    //                                 .then(result => {
    //                                     updateOriginalPost(result,createdBy)
    //                                     res.json(result)
    //                                 })
    //                                 .catch(err => res.json(err))
    //                             }
    //                         }
    //                         else{
    //                             Post.findByIdAndUpdate({_id:id},{
    //                                 $push: {
    //                                     isDisliked: req.user._id
    //                                 }
    //                             },{new: true, select: 'isLiked isDisliked'})
    //                             .then(result => {
    //                                 updateOriginalPost(result,createdBy)
    //                                 res.json(result)
    //                             })
    //                             .catch(err => res.json(err))
    //                         }
    //                     }
    //                 }
    //                 break;
    //             }
    //         })
    //         .catch(err => res.json(err))
    // }
    
    Post.findOne({_id: id}, 'isLiked isDisliked createdBy')
        .then(results => {
            let { createdBy } = results
            switch(actionType){
                case 'like': {
                    if(results.isLiked.length){
                        if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id:id},{
                                $pull: {
                                    isDisliked: req.user._id
                                },
                                $push: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                        else if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            // console.log('isLiked ------------> liked')
                            Post.findOneAndUpdate({_id:id},{
                                $pull: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                        else {
                            Post.findOneAndUpdate({_id:id},{
                                $push: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                    }
                    else{
                        if(results.isDisliked.length){
                            if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                                Post.findOneAndUpdate({_id:id},{
                                    $pull: {
                                        isDisliked: req.user._id
                                    },
                                    $push: {
                                        isLiked: req.user._id
                                    }
                                },{new: true, select: 'isLiked isDisliked'})
                                .then(result => {
                                    res.json(result)
                                })
                                .catch(err => res.json(err))
                            }
                            else {
                                Post.findByIdAndUpdate({_id:id},{
                                    $push: {
                                        isLiked: req.user._id
                                    }
                                },{new: true, select: 'isLiked isDisliked'})
                                .then(result => {
                                    res.json(result)
                                })
                                .catch(err => res.json(err))
                            }
                        }
                        else{
                            Post.findByIdAndUpdate({_id:id},{
                                $push: {
                                    isLiked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                    }
                    break;
                }
                case 'dislike': {
                    if(results.isDisliked.length){
                        if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            Post.findOneAndUpdate({_id:id},{
                                $pull: {
                                    isLiked: req.user._id
                                },
                                $push: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                        else if(results.isDisliked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                            // console.log('isLiked ------------> liked')
                            Post.findOneAndUpdate({_id:id},{
                                $pull: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                        else {
                            Post.findOneAndUpdate({_id:id},{
                                $push: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                    }
                    else{
                        if(results.isLiked.length){
                            if(results.isLiked.find(id => JSON.stringify(id) === JSON.stringify(req.user._id))){
                                Post.findOneAndUpdate({_id:id},{
                                    $pull: {
                                        isLiked: req.user._id
                                    },
                                    $push: {
                                        isDisliked: req.user._id
                                    }
                                },{new: true, select: 'isLiked isDisliked'})
                                .then(result => {
                                    res.json(result)
                                })
                                .catch(err => res.json(err))
                            }
                            else {
                                Post.findByIdAndUpdate({_id:id},{
                                    $push: {
                                        isDisliked: req.user._id
                                    }
                                },{new: true, select: 'isLiked isDisliked'})
                                .then(result => {
                                    res.json(result)
                                })
                                .catch(err => res.json(err))
                            }
                        }
                        else{
                            Post.findByIdAndUpdate({_id:id},{
                                $push: {
                                    isDisliked: req.user._id
                                }
                            },{new: true, select: 'isLiked isDisliked'})
                            .then(result => {
                                res.json(result)
                            })
                            .catch(err => res.json(err))
                        }
                    }
                }
                break;
            }
        }).catch(err => res.json(err))
}

postControllers.update = async(req,res) => {
    const {body} = req
    let dataPack = {
        postType: body.postType,
        post: body.post,
        friendTo: []
    }
    const url = req.protocol + '://' + req.get('host')
    const img = req.file
    if(img){
        dataPack.uploadPath = url + img.path.replace('uploads', '')
    }else if(body.uploadRemoved){
        dataPack.uploadPath = ''
    }
    // const io = req.app.io
    //console.log(dataPack)
    if(body.postType === 'Friends'){
        await User.findOne({_id: req.user._id},'friends')
            .then(result => {
                let friendIds = result.friends.map(friend => friend.info)
                //console.log(friendIds)
                dataPack.friendsTo = friendIds
            }).catch(err => res.json(err))
        Post.findOneAndUpdate({_id: req.params.id},dataPack,{new: true})
            .populate('createdBy', 'username profilePicUrl')
            .then(updatedPost => {
                res.json(updatedPost)
            }).catch(err => res.json(err))        
    }
    else{
        Post.findOneAndUpdate({_id: req.params.id},dataPack,{new: true})
            .populate('createdBy', 'username profilePicUrl')
            .then(updatedPost => {
                res.json(updatedPost)
            }).catch(err => res.json(err)) 
    }
}

module.exports = postControllers