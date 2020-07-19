const initialPostsState = []

const postReducer = (state = initialPostsState, action) => {
    switch(action.type){
        default: {
            return [...state]
        }
    }
}

export default postReducer