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

    case 'UPLOAD_FILE': {
      const data = state.friends.map((friend) => {
        if (friend.info._id === action.payload._id) {
          friend.inbox.push(action.payload.inbox)
          return friend
        } else {
          return friend
        }
      })
      return Object.assign({}, state, { friends: data })
    }

    case 'UPDATE_FRIEND_LIST': {
      return Object.assign({}, state, { friends: action.payload })
    }

    case 'FRIEND_CANCEL_REQUEST': {
      const deleteRequest = state.friends.filter(friend => friend.info._id !== action.payload._id)
      return Object.assign({},state,{ friends: deleteRequest })
    }

    case 'FRIEND_ACCEPT_REQUEST': {
      const data = state.friends.map(friend => {
        if(friend.info._id === action.payload._id){
          friend.status = action.payload.status
          friend.isFriend = action.payload.isFriend
          return friend
        }
        else {
          return friend
        }
      })
      return Object.assign({},state,{ friends: data })
    }

    case 'FRIEND_REJECT_REQUEST': {
      const rejectRequest = state.friends.filter(friend => friend.info._id !== action.payload._id)
      return Object.assign({},state,{ friends: rejectRequest })
    }

    case 'FRIEND_REMOVE': {
      const removeFriend = state.friends.filter(friend => friend.info._id !== action.payload._id)
      return Object.assign({},state,{ friends: removeFriend })
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
