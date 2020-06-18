import React from 'react'
import { Link , useHistory } from 'react-router-dom'
// ! https://stackoverflow.com/questions/54579730/react-hooks-with-react-router-v4-how-do-i-redirect-to-another-route

// material-ui 
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import { BsSearch } from 'react-icons/bs'

import { connect } from 'react-redux'
import { useState } from 'react'
import { startLogout } from '../../redux/actions/loginsAction'
import '../../styles/nav.css'

//import { AiOutlineUser } from 'react-icons/ai'
import logo from '../../styles/icons/logo.png'



function Nav(props) {
    const change = localStorage.getItem('token')
    const handleLogout = () => {
        props.dispatch(startLogout())
    }
    const handleSearch = (e) => {
        e.preventDefault()
        console.log('submit',searchUser)
    }
    const [searchUser,setSearchUser] = useState('')
    const handleChange = (e) =>{
        setSearchUser(e.target.value)
        console.log('print',e.target.value)
    }
    const history = useHistory()
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
                    <NavItem to='/chat' name='Chat'/>
                    <NavItem to='#' name='Sign Out' styleClass='sign-out' onClick = {handleLogout} />
                </NavBar>
            ):(
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
        <li className='nav-item'>
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

