import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startRegister } from '../../redux/actions/loginsAction'

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        show: false,
        mismatch: false,
        falseEntry: false,
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]:e.target.value })
    }
    handleShow = () => {
        this.setState(prevState => ({
            show: !prevState.show
        }))
    }
    handleOnBlur = () => {
        const {password,passwordConfirm} = this.state
        if(password !== passwordConfirm){
            this.setState({mismatch: true})
        }
        else{
            this.setState({ mismatch: false })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const redirect = () => {
            return this.props.history.push('/user/login')
        }
        const {username,password,email, mismatch} = this.state
        if(!username || !email || !password){
            this.setState({falseEntry: true})
        }
        else if(mismatch){
            alert('password do not match')
        }
        else{
            const formData = {
                username,email,password
            }
            console.log(formData)
            this.props.dispatch(startRegister(formData,redirect))
        }
    }
    render() {
        return (
          <div>
            <h1>Register</h1>
            <p className='errorMsg'>
              {this.state.falseEntry && 'The fields cant be empty'}
            </p>
            <br />
            <form onSubmit={this.handleSubmit}>
              <input
                type='text'
                name='username'
                id='username'
                value={this.state.username}
                onChange={this.handleChange}
                placeholder='username (min 6 characters)'
              />
              <br />
              <br />

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
                type='text'
                name='password'
                id='password'
                value={this.state.password}
                onChange={this.handleChange}
                placeholder='password (min 8 characters)'
              />
              <br />
              <br />

              <input
                type={this.state.show ? 'text' : 'password'}
                name='passwordConfirm'
                id='passwordConfirm'
                value={this.state.passwordConfirm}
                onChange={this.handleChange}
                onBlur={this.handleOnBlur}
                placeholder='Confirm Password'
              />
              <br />
              <br />
              <p className='errorMsg'>
                {this.state.mismatch && 'Password does not match'}
              </p>
              <br />
              <input
                type='checkbox'
                name='show'
                id='show'
                value={this.state.show}
                onClick={this.handleShow}
              />
              <label htmlFor='show'>Show Password</label>
              <br />
              <br />

              <input type='submit' value='Sign Up' />
            </form>
          </div>
        )
    }
}

export default connect()(Register)
