import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startLogin } from '../../redux/actions/loginsAction'

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
    this.props.dispatch(startLogin(formData,redirect))
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type='email'
            name='email'
            id='email'
            value={this.state.email}
            onChange={this.handleChange}
            placeholder='email'
          />
          <br />
          <br />
          <input
            type={this.state.show ? 'text' : 'password'}
            name='password'
            id='password'
            value={this.state.password}
            onChange={this.handleChange}
            placeholder='password'
          />
          <br />
          <br />
          <input
            type='checkbox'
            name='show'
            id='show'
            value={this.state.show}
            onClick={this.handleShow}
          />
          <label htmlFor='show'>Show password</label>
          <br />
          <br />
          <input type='submit' value='Sign In' />
        </form>
      </div>
    )
  }
}

export default  connect()(Login)
