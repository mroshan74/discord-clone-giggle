export const saveSignal = (data) => {
    return { type: 'SAVE_SIGNAL', payload:data}
}

export const appStateInCall = (status) => {
    return { type: 'INCALL_STATUS', payload: status}
}

export const appStateInCallReceiving = (status) => {
    return { type: 'INCALL_RECEIVING', payload: status}
}

export const appStateInCallInitiate = (status) => {
    return { type: 'INCALL_INITIATE', payload: status}
}

export const callStateClear = () => {
    return { type: 'CLEAR_CALL_STATE'}
}