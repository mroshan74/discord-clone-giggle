const initialChatState = {
    'friends.info' : null,
    'friends.inbox': null
}

const chatReducer = (state = initialChatState, action) => {
    switch(action.type){
        case 'SET_CHAT_INBOX': {
            return {
                'state.friends.info': action.payload.data.friends.info,
                'state.friends.inbox': action.payload.data.friends.inbox
            }
        }
        default: {
            return {...state}
        }
    }
}

export default chatReducer