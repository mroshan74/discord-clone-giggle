import React from 'react'
import PostCardItem from '../reusables/PostCardItem'
import { connect } from 'react-redux'

function Home(props) {
    const { publicPosts, userId } = props
    return (
        <div>
            <h1 style={{color: 'white'}}>Welcome to Giggle-DisBot</h1>
            {publicPosts?.map(post => {
                return <PostCardItem key={post._id} post={post} userId={userId}/>
            })}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        publicPosts: state.publicPosts,
        userId: state.login._id
    }
}

export default connect(mapStateToProps)(Home)