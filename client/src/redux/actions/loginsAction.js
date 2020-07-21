import axios from 'axios'
const getToken = localStorage.getItem('token')

//------------------register
export const startRegister = (fd, redirect ,regEnable) => {
  return () => {
    axios
      .post(`/users/register`, fd)
      .then((response) => {
        console.log('[PROMISE-login]', response.data)
        const res = response.data
        // if (res.hasOwnProperty('errors')) {
        //   alert('invalid/format username or password')
        // } else 
        if (res.hasOwnProperty('keyPattern')) {
          if (res.keyPattern.email === 1) {
            alert('email already exists')
            regEnable()
          } else {
            alert('username already exists')
            regEnable()
          }
        } else {
          alert('Successfully registered')
          regEnable()
          redirect()
        }
      })
      .catch((err) => console.log('ERROR-login', err))
  }
}

//------------------------login

export const startLogin = (fd, redirect) => {
  return () => {
    axios
      .post('/users/login', fd)
      .then((response) => {
        console.log('[PROMISE-token-login]', response.data)
        if (response.data.hasOwnProperty('error')) {
          alert(response.data.error)
        } else {
          const authToken = response.data.token
          localStorage.setItem('token', authToken)
          alert('Login Successful')
          redirect()
          window.location.reload()
        }
      })
      .catch((err) => console.log(err))
  }
}

//-----------------logout
export const clearUser = () => {
  return { type: 'CLEAR_USER_DATA' }
}
export const startLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('token')
    dispatch(clearUser())
    window.location.href = '/'
    //window.location.reload()
  }
}

//-------------------account
export const setAccount = (data) => {
  return { type: 'SET_USER_DATA', payload: data }
}

export const startAccount = () => {
  return (dispatch) => {
    axios
      .get('/users/account', { headers: { 'x-auth': getToken } })
      .then((response) => {
        console.log('[PROMISE-login-acc]', response.data)
        const data = response.data
        if(data.hasOwnProperty('errors')){
          localStorage.removeItem('token')
          alert('session expired')
          window.location.href = '/users/login'
        }else{
          dispatch(setAccount(data))
        }
      })
      .catch((err) => console.log(err))
  }
}
