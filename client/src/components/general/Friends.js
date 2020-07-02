import React from 'react'
import { connect } from 'react-redux'

import { Card, CardList } from '../reusables/Card'
import { startSendRequest, startCancelRequest, startAcceptRequest, startRejectRequest, startRemoveFriend } from '../../redux/actions/searchAction'
import { startFriendSendRequest, startFriendCancelRequest } from '../../redux/actions/friendsAction'


function Friends(props) {
    const handleRequest = (id,isFriend,sendByMe,status) => {
        if(!isFriend){
            props.dispatch(startFriendSendRequest(id))
        }
        else{
            if(sendByMe && status === 'Pending'){
                props.dispatch(startFriendCancelRequest(id))
            }
        }
    }

    const handleAcceptRequest = (id) => {
        props.dispatch(startAcceptRequest(id))
    }

    const handleRejectRequest = (id) => {
        props.dispatch(startRejectRequest(id))
    }

    const handleRemoveFriend = (id) => {
        props.dispatch(startRemoveFriend(id))
    }

    const { friends } = props
    let isFriend = true

    return (
        <div>
            <Card >
                { friends && friends.map(friend => {
                    return <CardList 
                                key={friend._id} 
                                username={friend.info.username}
                                img={friend.info.profilePicUrl}
                                isFriend={isFriend}
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
