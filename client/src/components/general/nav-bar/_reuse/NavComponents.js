import React from 'react'
import { Link } from 'react-router-dom'

export function NavBar(props){
    let navMoveToEnd = ''
    if(!localStorage.getItem('token')){
        navMoveToEnd = 'navMoveToEnd'
    }
    return (
        <nav className='navbar'>
            <ul className={`navbar-nav ${navMoveToEnd}`}> {props.children} </ul>
        </nav>
    )
}

export function NavItem(props){
    return (
        <li className={`nav-item ${props.styleClassLi}`}>
            <Link className={`link-item ${props.styleClass}`} to={props.to} onClick={props.onClick}>{props.name}</Link>
        </li>
    )
}