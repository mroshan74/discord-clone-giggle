import React from 'react'
import { connect } from  'react-redux'
import PostCardItem from '../reusables/PostCardItem'


function PostList(props) {
    const { posts } = props
    console.log(posts,'-----> posts')
    return(
        <div>
            {posts?.map(post => {
                return <PostCardItem key={post._id} post={post} />
            })}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.login.posts
    }
}
export default connect(mapStateToProps)(PostList)

