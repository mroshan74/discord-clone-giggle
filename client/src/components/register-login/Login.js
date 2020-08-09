import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startLogin } from '../../redux/actions/loginsAction'
import { Link } from 'react-router-dom'
import '../../styles/login.css'
class Login extends Component {
  state = {
    email: '',
    password: '',
    show: false,
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleShow = () => {
    this.setState((prevState) => ({
      show: !prevState.show,
    }))
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const redirect = () => {
      return this.props.history.push('/')
    }
    const { email, password } = this.state
    const formData = {
      email,
      password,
    }
    console.log(formData)
    this.props.dispatch(startLogin(formData, redirect))
  }
  render() {
    return (
      <div className='login-bg'>
        <div className='login-container'>
          <div className='login-logo'>
            <img
              className={'login-logo-img'}
              src={require('../../styles/icons/login-logo-blk.png')}
              alt='logo'
            />
          </div>
          <form className='login-form' onSubmit={this.handleSubmit}>
            <div className='form-control'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                id='email'
                value={this.state.email}
                onChange={this.handleChange}
                placeholder='Enter your email'
              />
            </div>

            <div className='form-control'>
              <label htmlFor='password'>Password</label>
              <input
                type={this.state.show ? 'text' : 'password'}
                name='password'
                id='password'
                value={this.state.password}
                onChange={this.handleChange}
                placeholder='Password'
              />
            </div>

            <div className='checkbox-control'>
              <div>
                <input
                  type='checkbox'
                  name='show'
                  id='show'
                  value={this.state.show}
                  onClick={this.handleShow}
                />
                <label htmlFor='show'>Show password</label>
              </div>
              <Link className='link' to='#'>
                Forgot Password ?
              </Link>
            </div>

            <input className='btn-login' type='submit' value='Sign In' />
            <small>
              Don't have an account?
              <Link className='link' to='/users/register'>
                Sign Up
              </Link>
            </small>
          </form>
        </div>
      </div>
    )
  }
}

export default connect()(Login)
