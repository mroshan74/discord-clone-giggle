import React from 'react'
import { connect } from  'react-redux'
import PostCardItem from '../reusables/PostCardItem'


function PostList(props) {
    const { posts, userId } = props
    console.log(posts,'-----> posts')
    return(
        <div>
            {posts?.map(post => {
                return <PostCardItem 
                    key={post._id} 
                    post={post} 
                    userId={userId} 
                />
            })}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        posts: state.login.posts,
        userId: state.login._id
    }
}
export default connect(mapStateToProps)(PostList)

