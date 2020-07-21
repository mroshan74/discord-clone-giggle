import React from 'react'
import { connect } from 'react-redux'

import { Card, CardList } from '../reusables/Card'
import { startSendRequest, startCancelRequest, startAcceptRequest, startRejectRequest, startRemoveFriend } from '../../redux/actions/searchAction'

function Search(props) {
    const handleRequest = (id,isFriend,sendByMe,status) => {
        if(!isFriend){
            props.dispatch(startSendRequest(id))
        }
        else{
            if(sendByMe && status === 'Pending'){
                props.dispatch(startCancelRequest(id))
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

    return (
        <div>
            <Card >
                {props.results && props.results.map(user => {
                    return <CardList 
                                key={user._id} 
                                username={user.username}
                                img={user.profilePicUrl}
                                isFriend={user.isFriend}
                                status={user.status && user.status}
                                handleRequest={handleRequest}
                                _id={user._id}
                                sendByMe={user.sendByMe}
                                handleAccept={handleAcceptRequest}
                                handleReject={handleRejectRequest}
                                handleRemove={handleRemoveFriend}
                            />
                })}
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        results: state.searchResult
    }
}

export default connect(mapStateToProps)(Search)
