import React from 'react'
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
    return (
        <div className='card-item-wrap'>
            <img className='avatar' src={props.img} alt={props.username} />
            <li className='card-item'>{props.username}</li>
            <button className='btn'>Click Me</button>
        </div>
    )
}
