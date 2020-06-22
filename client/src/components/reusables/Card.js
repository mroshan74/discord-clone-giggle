import React, { Fragment } from 'react'
import './card.css'
import {Button } from '@material-ui/core'

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
        img,username,_id,isFriend,sendByMe,status, handleRequest
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
                            <button className='btn'>Accept</button>
                            <button>Reject</button>
                        </Fragment>
                    }
                </Fragment> 
                :
                <button className='btn' onClick={() => {handleRequest(_id,isFriend)}}>Add Friend</button>
            }
        </div>
    )
}
//props.handleRequest(_id,isFriend,status)
// isFriend ? 
// (status=== 'Pending' ? 'Cancel Request' :'Remove Friend')
// : 'Add Friend'
