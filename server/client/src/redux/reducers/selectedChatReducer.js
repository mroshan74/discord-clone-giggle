const initialState = null

const selectedChatReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SELECTED_ID': {
            return state = action.payload
        }
        default: {
            return state
        }
    }
}

export default selectedChatReducer