const initialSearchResult = []

const searchReducer = ( state = initialSearchResult, action ) => {
    switch(action.type){
        case 'SET_SEARCH_RESULT': {
            return state=action.payload
        }
        case 'SET_SENT_REQUEST': {
            return state.map(user => {
                if(user._id===action.payload._id){
                    return Object.assign({},user, action.payload)
                }
                else{
                    return Object.assign({},user)
                }
            })
        }
        case 'SET_CANCEL_REQUEST': {
            return state.map(user => {
                if(user._id===action.payload._id){
                    return Object.assign({},user, action.payload)
                }
                else{
                    return Object.assign({},user)
                }
            })
        }
        default: {
            return [...state]
        }
    }
}

export default searchReducer