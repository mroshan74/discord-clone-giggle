import React from 'react'
import PostCardItem from '../reusables/PostCardItem'
import { connect } from 'react-redux'

function Home(props) {
    const { posts, userId } = props
    return (
        <div>
            <h1 style={{color: 'white'}}>Welcome to Giggle-DisBot</h1>
            {posts?.map(post => {
                return <PostCardItem key={post._id} post={post} userId={userId}/>
            })}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.posts,
        userId: state.login._id
    }
}

export default connect(mapStateToProps)(Home)