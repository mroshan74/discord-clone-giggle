import React from 'react'
import { useHistory, Redirect  } from 'react-router-dom'
// ! https://stackoverflow.com/questions/54579730/react-hooks-with-react-router-v4-how-do-i-redirect-to-another-route

// material-ui 
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Badge from '@material-ui/core/Badge'
import { BsSearch } from 'react-icons/bs'
import { FiMail } from 'react-icons/fi'
import { FaSignOutAlt } from 'react-icons/fa'
import { BsChatDots } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'

import { connect } from 'react-redux'
import { useState } from 'react'
import { startLogout } from '../../../redux/actions/loginsAction'
import { NavBar, NavItem } from './_reuse/NavComponents'
import './Navbar.css'

import logo from './_reuse/logo.png'
import { startGetSearch } from '../../../redux/actions/searchAction'
import PostIcon from './_reuse/post.png'
import AppBar from './AppBar'


function Nav(props) {

    const history = useHistory()
    const change = localStorage.getItem('token')
    
    const [searchUser,setSearchUser] = useState('')
    const handleChange = (e) =>{
        setSearchUser(e.target.value)
        // console.log('print',e.target.value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const fd = { searchUser }
        props.dispatch(startGetSearch(fd))
        console.log('submit',searchUser)
        history.push('/users/search')
    }
    
    const handleLogout = () => {
        props.dispatch(startLogout())
    }
    
    console.log('nav----',change)
    console.log('USER--------',props.user)

    return (
        <>
            {change ? 
            (
                <div className='nav-container'>
                    <div className='navHide'>
                        <NavBar >
                            <img src={logo} alt='chatbot' className='logo' onClick={() => {history.push('/')}}/>
                            <form className='search-bar' onSubmit={handleSearch}>
                                <TextField
                                    className='search-input'
                                    variant='outlined'
                                    placeholder='Search...'
                                    onChange={handleChange}
                                    value={searchUser}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsSearch />
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                            </form>
                            <NavItem 
                                to='/users/notifications' 
                                styleClass='badge'
                                styleClassLi='badge-li'
                                name={
                                        <Badge badgeContent={props.user.notifications.length} color="secondary">
                                            <FiMail />
                                        </Badge>
                                    }
                            />
                            <NavItem to='/users/posts' name={<img src={PostIcon} alt='postIcon'/>} styleClass='post-icon-nav'/>
                            <NavItem to='/users/friends' name={<FaUserFriends/>} />
                            <NavItem to='/users/chat' name={<BsChatDots/>}/>
                            <NavItem to='#' name={<FaSignOutAlt/>} styleClass='sign-out' onClick = {handleLogout} />
                        </NavBar>
                        <p>{props.user._id && <span>{props.user.username} - {props.user.email}</span>}</p>
                    </div>
                    <AppBar/>
                </div>
            ):(
                <Redirect to='/users/login'/>
            )
            }
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.login
    }
}

export default connect(mapStateToProps)(Nav)

