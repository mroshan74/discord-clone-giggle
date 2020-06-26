const initialStateLogin = {
  _id: '',
  username: '',
  email: '',
  profileImg:'',
  notifications: [],
  friends: []
}

const loginReducer = (state = initialStateLogin, action) => {
  switch (action.type) {
    case 'SET_USER_DATA': {
      return Object.assign({}, state, {
        _id: action.payload._id,
        username: action.payload.username,
        email: action.payload.email,
        profileImg: action.payload.profilePicUrl,
        notifications: action.payload.notifications,
        friends: action.payload.friends
      })
    }
    case 'SET_SEND_MSG': {
      const data = state.friends.map(friend => {
          if(friend.info._id === action.payload._id){
            friend.inbox.push(action.payload.inbox)
            return friend
          }
          else {
            return friend
          }
      })
      //console.log('DATA-LOGIN-REDUCER',data)
      return Object.assign({},state,{ friends: data })
    }
    case 'CLEAR_USER_DATA': {
      return Object.assign({}, state, {
        _id: '',
        username: '',
        email: '',
        profileImg:'',
        notification: [],
        friends:[]
      })
    }
    default: {
      return { ...state }
    }
  }
}

export default loginReducer
