const initialPostsState = []

const postReducer = (state = initialPostsState, action) => {
    switch(action.type){
        case 'SET_PUBLIC_POSTS': {
            return state=action.payload
        }
        case 'ADD_NEW_PUBLIC_POST': {
            return [action.payload].concat(state)
        }
        default: {
            return [...state]
        }
    }
}

export default postReducer