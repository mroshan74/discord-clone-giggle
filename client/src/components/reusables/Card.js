import React, { Fragment } from 'react'
import './card.css'

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
            <li className='card-item'>{props.username}</li>
            {
                isFriend ?
                <Fragment>
                    {(sendByMe && status==='Pending') ? 
                        <button className='btn' onClick={() => {handleRequest(_id,isFriend,sendByMe,status)}}>Cancel Request</button> :
                        <Fragment>
                            {status === 'Accepted' ? 
                                <button className='btn' onClick={() => {handleRemove(_id)}}>Remove Friend</button> : status=== 'Pending' &&
                                <Fragment>
                                    <button className='btn' onClick={() => {handleAccept(_id)}}>Accept</button>
                                    <button onClick={() => {handleReject(_id)}}>Reject</button>
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

