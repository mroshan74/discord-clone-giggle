export const storeSelectedId = (data) => {
    return { type: 'SELECTED_ID', payload: data}
}


export const startStoreSelectedId = (data) => {
    return(dispatch) => {
        dispatch(storeSelectedId(data))
    }
}