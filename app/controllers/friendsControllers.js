const User = require('../models/user')
const friendsControllers = {}


// cancel request
friendsControllers.cancelRequest = (req,res) => {
    const friendId = req.params.id

    //! cancel request from the receivers id -> check if the request user is present
    User.findOneAndUpdate({_id: friendId, 'friends.info': req.user._id},
    {
        $pull: { 
            friends: { info: req.user._id },
            notifications: {info: req.user._id}
        }
    }).catch(err => res.json(err))

    //! cancel request from the user 
    User.findOneAndUpdate({_id: req.user._id, 'friends.info': friendId},
    {
        $pull: { friends: { info: friendId } }
    },
    { new : true })
    .then(user => {
        if(user){
            res.json(
                {
                    isFriend: false,
                    _id: friendId,
                    status:'Cancelled'
                })
        }else{
            res.json({
                errors: 'invalid user',
                message: 'No user found in database'
            })
        }
    })
    .catch(err => res.json(err))        
}

// accept friend request
friendsControllers.acceptRequest = (req,res) => {
    const friendId = req.params.id
    const friendName = req.params.friendName

    User.findOne({
            _id: friendId, 
            'friends.info':req.user._id, 
            //'friends.status':'Accepted',
            friends: { elemMatch: {status: 'Accepted'}}
        })
        .then(user => {
            console.log(user)
            if(!user){    //? if empty only execute
                //! the requester update
                User.findOneAndUpdate({ _id: friendId , 'friends.info': req.user._id },{
                    $set: { 'friends.$.status': 'Accepted' },
                    $push: {
                        notifications: { 
                            info: req.user._id,
                            message: `${req.user.username} accepted your friend request`
                        }}
                })
                .then(user => {
                    if(!user){
                        res.json({
                            errors: 'invalid user',
                            message: 'No user found in database'
                        })
                    }
                }).catch(err => res.json(err))
            
                //! receiver update
                User.findOneAndUpdate({ _id: req.user._id , 'friends.info': friendId},{
                    $set: { 'friends.$.status': 'Accepted' },
                    $push: { notifications : {
                        info: friendId,
                        message: `You are now friend with ${friendName}`
                    }}
                }, {new:true})
                    .then(user => {
                        if(user){
                            User.findOne({_id: user._id})
                                .populate('friends.info','username profilePicUrl')
                                .populate('notifications.info','username profilePicUrl')
                                .then(user => {
                                    if(user){
                                        res.json({
                                            isFriend: true,
                                            _id: friendId,
                                            status:'Accepted'
                                        })
                                    }
                                    else{
                                        res.json({
                                            errors: 'invalid user',
                                            message: 'No user found in database'
                                        })
                                    }
                                }).catch(err => res.json(err))
                        }
                    }).catch(err => res.json(err))
            }
            else{
                res.json({
                    errors: 'invalid action',
                    message:' No access authorization'
                })
            }
        }).catch(err => res.json(err))
}

// reject friend request
friendsControllers.rejectRequest = (req,res) => {
    const friendId = req.params.id

    User.findOne({ 
        _id :friendId , 
        'friends.info':req.user._id, 
        friends: { $elemMatch: {status: 'Rejected'}} 
    })
        .then(user => {
            if(!user){
                //! requester update
                User.findOneAndUpdate({ _id: friendId, 'friends.info':req.user._id },{
                    $set: { 
                        'friends.$.status': 'Rejected',
                        'friends.$.isFriend': false
                    }
                })
                    .then(user => {
                        if(!user){
                            res.json({
                                errors: 'invalid user',
                                message: 'No user found in database'
                            })
                        }
                    }).catch(err => res.json(err))

                //! receiver update
                User.findOneAndUpdate({ _id: req.user._id , 'friends.info': friendId},{
                    $set: { 
                        'friends.$.status': 'Rejected',
                        'friends.$.isFriend': false
                    }
                })
                    .then(user => {
                        if(user){
                            res.json({
                                isFriend: false,
                                _id: friendId,
                                status:'Rejected'
                            })
                        }
                        else{
                            res.json({
                                errors: 'invalid user',
                                message: 'No user found in database'
                            })
                        }
                    }).catch(err => res.json(err))
            }else{
                res.json({
                    errors: 'invalid action',
                    message: 'No access authorization'
                })
            }
        }).catch(err => res.json(err))
}

// remove friend
friendsControllers.removeFriend = (req,res) => {
    const friendId = req.params.id
    
    User.findOne({
        _id: friendId, 
        'friends.info': req.user._id, 
        friends: {$elemMatch: {status: 'Accepted'}}
    })
        .then(user => {
            if(user){
                //! requester
                User.findOneAndUpdate({_id: friendId, 'friends.info': req.user._id},{
                    $pull : {
                        friends: {
                            info: req.user._id
                        }
                    }
                })
                    .then(user => {
                        if(!user){
                            res.json({
                                errors: 'invalid user',
                                message: 'No user found in database'
                            })
                        }
                    })
                    .catch(err => res.json(err))

                //! receiver
                User.findOneAndUpdate({_id: req.user._id, 'friends.info': friendId},{
                    $pull : {
                        friends: {
                            info: friendId
                        }
                    }
                })
                    .then(user => {
                        if(user){
                            res.json({
                                isFriend: false,
                                _id: friendId,
                                status: 'Pending'
                            })
                        }else{
                            res.json({
                                errors: 'invalid user',
                                message: 'No user found in database'
                            })
                        }
                    })
                    .catch(err => res.json(err))

            }else{
                res.json({
                    errors: 'invalid action',
                    message: 'No access authorization'
                })
            }
        })
        .catch(err => res.json(err))
}

// friend list
friendsControllers.friendList = (req,res) => {
    User.findOne({_id: req.user._id},'friends ')
        .populate('friends.info', 'username profilePicUrl')
        .then(user => {
            const listFriends = user.friends.filter(friend => friend.status !== 'Rejected')
            
            //🧾 https://stackoverflow.com/questions/45924821/javascript-sorting-array-of-objects-by-string-property
            listFriends.sort((a,b) => {
                return (a.status < b.status) ? 1 : ((b.status < a.status) ? -1 : 0)
            })
            res.json(listFriends)
        })
        .catch(err => res.json(err))
}

module.exports = friendsControllers