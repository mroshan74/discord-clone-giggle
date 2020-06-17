const initialChatState = []

const chatReducer = (state = initialChatState, action) => {
    switch(action.type){
        case 'SET_CHAT': {
            return state.concat(action.payload)
        }
        case 'AFTER_CHAT_SUBMIT': {
            return state.concat(action.payload)
        }
        default: {
            return [...state]
        }
    }
}

export default chatReducer