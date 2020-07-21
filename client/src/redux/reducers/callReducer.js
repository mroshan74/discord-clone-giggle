const initialCallState = {
    signal: null,
    inCall: false,
    callInitiator: false,
    callReceiving: false
}

const callReducer = ( state = initialCallState, action ) => {
    switch(action.type){
        case 'SAVE_SIGNAL': {
            return Object.assign({}, state, {signal: action.payload})
        }
        case 'INCALL_STATUS': {
            return Object.assign({},state, {inCall: action.payload})
        }
        case 'INCALL_RECEIVING': {
            return Object.assign({} , state, {inCall: action.payload, callReceiving: action.payload})
        }
        case 'INCALL_INITIATE': {
            return Object.assign({}, state, {inCall:action.payload, callInitiator: action.payload})
        }
        case 'CLEAR_CALL_STATE': {
            return Object.assign({}, state, {
                signal: null,
                inCall: false,
                callInitiator: false,
                callReceiving: false,
            })
        }
        default: {
            return state
        }
    }
}

export default callReducer