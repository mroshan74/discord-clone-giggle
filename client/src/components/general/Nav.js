import React from 'react'
import { Link , useHistory } from 'react-router-dom'
// ! https://stackoverflow.com/questions/54579730/react-hooks-with-react-router-v4-how-do-i-redirect-to-another-route

// material-ui 
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Badge from '@material-ui/core/Badge'
import { BsSearch } from 'react-icons/bs'
import { FiMail } from 'react-icons/fi'

import { connect } from 'react-redux'
import { useState } from 'react'
import { startLogout } from '../../redux/actions/loginsAction'
import '../../styles/nav.css'

import logo from '../../styles/icons/logo.png'
import { startGetSearch } from '../../redux/actions/searchAction'


function Nav(props) {
    const change = localStorage.getItem('token')
    const history = useHistory()

    const handleLogout = () => {
        props.dispatch(startLogout())
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const fd = { searchUser }
        props.dispatch(startGetSearch(fd))
        console.log('submit',searchUser)
        history.push('/user/search')

    }
    const [searchUser,setSearchUser] = useState('')
    const handleChange = (e) =>{
        setSearchUser(e.target.value)
        // console.log('print',e.target.value)
    }

    console.log('nav----',change)
    console.log('USER--------',props.user)

    return (
        <div>
            {change ? 
            (
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
                        to='/user/notifications' 
                        styleClass='badge'
                        styleClassLi='badge-li'
                        name={
                                <Badge badgeContent={props.user.notifications.length} color="secondary">
                                    <FiMail />
                                </Badge>
                            }
                    />
                    <NavItem to='/chat' name='Chat'/>
                    <NavItem to='#' name='Sign Out' styleClass='sign-out' onClick = {handleLogout} />
                </NavBar>
            ):(
                <NavBar >
                    <img src={logo} alt='chatbot' className='logo' onClick={() => {history.push('/')}}/>
                    {/* <form className='search-bar' onSubmit={handleSearch}>
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
                    </form> */}
                    <NavItem to='/user/register' name='Register' styleClass='register'/>
                    <NavItem to='/user/login' name='Sign In' styleClass='sign-in' />
                </NavBar>
            )
            }
            <br/><br/>
            <p>{props.user._id && <span>{props.user.username} - {props.user.email}</span>}</p>
        </div>
    )
}

function NavBar(props){
    return (
        <nav className='navbar'>
            <ul className='navbar-nav'> {props.children} </ul>
        </nav>
    )
}
function NavItem(props){
    return (
        <li className={`nav-item ${props.styleClassLi}`}>
            <Link className={`link-item ${props.styleClass}`} to={props.to} onClick={props.onClick}>{props.name}</Link>
        </li>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.login
    }
}

export default connect(mapStateToProps)(Nav)

