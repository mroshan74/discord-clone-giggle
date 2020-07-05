const User = require('../models/user')
const searchControllers = {}

//!------------search for users
searchControllers.search = (req,res) => {
    const search = req.body.searchUser
    //console.log(search)
    //console.log(req.user)
    const str= ('.*var.*').replace('var', search) //? 🚀--> regexr.com/56ucp -> /\w*${search}\w*/gi
    const regex = RegExp(str)
    //console.log(regex)
    User.find({ 
        username : { $regex : regex, $options: 'i'},
        _id: { $ne : req.user._id }, // ? not equal -> doesn't need our own result
        'friends.status': { $ne: 'Rejected'}
    },'username profilePicUrl friends')
        .then(async users => {
            if(users.length){
                //? 🧾 https://dev.to/nyagarcia/array-map-async-await-2cif
                //? 🔥  https://www.taniarascia.com/promise-all-with-async-await/
                let listed = await Promise.all(
                    users.map(async user => {
                        const dataPack = {
                            _id: user._id,
                            username: user.username,
                            profilePicUrl: user.profilePicUrl
                        }
                        async function checkFriend(){
                        //function checkFriend(){
                            try{
                                let result = await User.findOne({
                                    _id: user._id, 
                                    'friends.info': req.user._id, 
                                    //'friends.status': { $ne: 'Rejected'}
                                },
                                    'friends.info friends.status friends.sendByMe')
                                //console.log(result,'try--->result async ***')
                                return result
                            }catch(e){
                                console.log(e)
                            }
                        }
                        if(user.friends.length){
                            // TODO filter isFriend

                            let alreadyFriend = await checkFriend()
                            
                            //console.log('+SHOULD BE HERE+',alreadyFriend)
                            if(alreadyFriend){
                                //console.log('DUMMY TRUE IS FRIEND')
                                const getFriendStatus = alreadyFriend.friends.find(friend => JSON.stringify(friend.info) === JSON.stringify(req.user._id))
                                //console.log('getFriendStatus',getFriendStatus)
                                return Object.assign({}, dataPack, { 
                                    isFriend: true , 
                                    status: getFriendStatus.status,
                                    // 🔥found the requester id -> if sendByMe is false in his database then it is sent by the requester -> so we use negation
                                    sendByMe: !getFriendStatus.sendByMe
                                })
                            }
                            else{
                                return Object.assign({}, dataPack, {isFriend:false})
                            }
                        }
                        else{
                            return Object.assign({},dataPack, {isFriend:false})
                            //return Object.assign({},user) -> send the entire schema structure
                        }
                    })
                )  //!----- Promise ALL
                //console.log('listed',listed)
                //console.log('**************************LAST PRIORITY ++++++++++++++++++++++')
                
                // sort array to show friended list first
                listed.sort((a,b) => { return b.isFriend - a.isFriend
                    // 🔥 https://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property
                    // let A = a.isFriend,
                    //     B = b.isFriend
                    // return A === B ? 0 : A ? -1 : 1
                })
                res.json(listed)
                // ! res.json(users)
            }
            else{
                res.json({
                    errors: 'invalid',
                    message: 'No users found'
                })
            }
        })
        .catch(err => res.json(err))
}


//-------------sent friend request
searchControllers.sendRequest = (req,res) => {
    const friendId = req.params.id
    //console.log('REQUEST ID', req.params.id)
    //! checking a request has already sent or friends already
    User.find({ _id: req.user._id ,'friends.info': friendId })
    .then(user => {
        if(!user.length){  // --> 0 requests or not friends check 
        //!--------sent request and update the receiver database 
            User.findOneAndUpdate(
                { _id: friendId },
                { $push: {
                    friends: { info: req.user._id },
                    notifications: {  
                        info: req.user._id,
                        message: `${req.user.username} sent you a friend request`
                    }
                }})
                // .then(user => {
                //     console.log(user)
                    // User.findOne({_id: user._id})
                    //     .populate('friends.info','username profilePicUrl ')
                    //     .catch(err => res.json(err))
                //})
                .then()
                .catch(err => res.json(err))

        //!--------update the sender database
            User.findOneAndUpdate({_id: req.user._id},{
                $push: {
                    friends: { info: friendId, sendByMe: true }
                }},
                {new: true})

                .then(()=> {
                        res.json(
                            {
                                isFriend: true,
                                status: "Pending",
                                _id: friendId,
                                sendByMe: true
                            })
                }).catch(err => res.json(err))
        }
        else{
            res.json({
                errors: 'invalid',
                message: 'Either a request has already been sent or you are already friends'
            })
            //res.json(user)
        }
    }).catch(err => res.json(err))
}


// cancel request
searchControllers.cancelRequest = (req,res) => {
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
searchControllers.acceptRequest = (req,res) => {
    const friendId = req.params.id

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
                        message: `You are now friend with ${friendId}`
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
searchControllers.rejectRequest = (req,res) => {
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
searchControllers.removeFriend = (req,res) => {
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

module.exports = searchControllers