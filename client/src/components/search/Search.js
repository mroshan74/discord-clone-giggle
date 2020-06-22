import React from 'react'
import { connect } from 'react-redux'

import { Card, CardList } from '../reusables/Card'
import { startSendRequest, startCancelRequest } from '../../redux/actions/searchAction'

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
