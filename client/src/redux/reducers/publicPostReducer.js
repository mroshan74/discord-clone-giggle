const initialPostsState = []

const postReducer = (state = initialPostsState, action) => {
    switch(action.type){
        case 'SET_PUBLIC_POSTS': {
            return state=action.payload
        }
        default: {
            return [...state]
        }
    }
}

export default postReducer