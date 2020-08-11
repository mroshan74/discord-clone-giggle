const initialStateLogin = {
  _id: '',
  username: '',
  email: '',
  profileImg:'',
  notifications: [],
  friends: [],
  posts: []
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
        friends: action.payload.friends,
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

    case 'SET_USER_POSTS': {
      return Object.assign({}, state, { posts: action.payload })
    }

    case 'ADD_NEW_POST': {
      const newPostArray = [action.payload].concat(state.posts)
      return Object.assign({}, state, { posts: newPostArray })
    }

    case 'DELETE_POST': {
      const newPostArray = state.posts.filter(post => post._id !== action.payload._id)
      return Object.assign({}, state, { posts: newPostArray })
    }

    case 'UPDATE_POST': {
      const newPostArray = state.posts.map(post => {
        if(post._id===action.payload._id){
          return Object.assign({}, post, action.payload)
        }
        else {
          return Object.assign({},post)
        }
      })
      return Object.assign({}, state, { posts: newPostArray })
    }

    case 'CLEAR_USER_DATA': {
      return Object.assign({}, state, {
        _id: '',
        username: '',
        email: '',
        profileImg:'',
        notification: [],
        friends:[],
        posts: [],
      })
    }
    default: {
      return { ...state }
    }
  }
}

export default loginReducer
