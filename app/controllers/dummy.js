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
