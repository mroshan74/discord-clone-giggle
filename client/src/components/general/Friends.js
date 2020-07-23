import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { Card, CardList } from '../reusables/Card'
import { startCancelFriendRequest, startAcceptFriendRequest, startRejectFriendRequest, startFriendRemove, startGetFriendList } from '../../redux/actions/friendsAction'


function Friends(props) {
    const handleRequest = (id,isFriend,sendByMe,status) => {
        if(isFriend){
            if(sendByMe && status === 'Pending'){
                props.dispatch(startCancelFriendRequest(id))
            }
        }
    }

    const handleAcceptRequest = (id,username) => {
        props.dispatch(startAcceptFriendRequest(id,username))
    }

    const handleRejectRequest = (id) => {
        props.dispatch(startRejectFriendRequest(id))
    }

    const handleRemoveFriend = (id) => {
        props.dispatch(startFriendRemove(id))
    }

    const { friends } = props

    useEffect(() => {
        props.dispatch(startGetFriendList())
        //console.log('Loaded friend List')
    // eslint-disable-next-line
    },[])

    return (
        <div>
            <Card >
                { friends && friends.map(friend => {
                    return <CardList 
                                key={friend._id} 
                                username={friend.info.username}
                                img={friend.info.profilePicUrl}
                                isFriend={friend.isFriend}
                                status={friend.status && friend.status}
                                handleRequest={handleRequest}
                                _id={friend.info._id}
                                sendByMe={friend.sendByMe}
                                handleAccept={handleAcceptRequest}
                                handleReject={handleRejectRequest}
                                handleRemove={handleRemoveFriend}
                            />
                })}
            </Card>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        friends: state.login.friends
    }
}

export default connect(mapStateToProps)(Friends)
