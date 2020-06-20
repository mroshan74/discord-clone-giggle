const initialSearchResult = []

const searchReducer = ( state = initialSearchResult, action ) => {
    switch(action.type){
        case 'SET_SEARCH_RESULT': {
            return state=action.payload
        }
        default: {
            return [...state]
        }
    }
}

export default searchReducer