import React from 'react'
import { connect } from 'react-redux'

import { Card, CardList } from '../reusables/Card'

function Search(props) {
    console.log(props.result)
    return (
        <div>
            <Card >
                {props.results && props.results.map(user => {
                    return <CardList 
                                key={user._id} 
                                username={user.username}
                                img={user.profilePicUrl}
                            />
                })}
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        results: state.searchResult
    }
}

export default connect(mapStateToProps)(Search)
