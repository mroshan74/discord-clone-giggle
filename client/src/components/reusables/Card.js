import React, { Fragment } from 'react'
import './Card.css'

export function Card(props) {
    return (
        <div className='card'>
            <ul className='card-wrap'>
                {props.children}
            </ul>
        </div>
    )
}

export function CardList(props) {
    const {
        img,username,_id,isFriend,sendByMe,status, handleRequest, handleAccept, handleReject,handleRemove
    } = props
    return (
        <div className='card-item-wrap'>
            <img className='avatar' src={img} alt={username} />
            <li className='card-item'>{username}</li>
            {
                isFriend ?
                <Fragment>
                    {(sendByMe && status==='Pending') ? 
                        <button className='btn btn-cancel-friend' onClick={() => {handleRequest(_id,isFriend,sendByMe,status)}}>Cancel Request</button> :
                        <Fragment>
                            {status === 'Accepted' ? 
                                <button className='btn btn-remove-friend' onClick={() => {handleRemove(_id)}}>Remove</button> : status=== 'Pending' &&
                                <Fragment>
                                    <button className='btn btn-accept-friend' onClick={() => {handleAccept(_id,username)}}>Accept</button>
                                    <button className={'btn btn-reject-friend'} onClick={() => {handleReject(_id)}}>Reject</button>
                                </Fragment>
                        }
                        </Fragment>
                    }
                </Fragment> 
                :
                <button className='btn' onClick={() => {handleRequest(_id,isFriend)}}>Add Friend</button>
            }
        </div>
    )
}

