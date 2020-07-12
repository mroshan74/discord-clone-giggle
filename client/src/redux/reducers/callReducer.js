const initialCallState = null

const callReducer = ( state = initialCallState, action ) => {
    switch(action.type){
        case 'SAVE_SIGNAL': {
            return state = action.payload
        }
        default: {
            return state
        }
    }
}

export default callReducer