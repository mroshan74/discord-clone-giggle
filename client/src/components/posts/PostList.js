import React from 'react'
import { connect } from  'react-redux'
import PostCardItem from '../reusables/PostCardItem'
import { startDeletePost } from '../../redux/actions/postsAction'


function PostList(props) {
    const { posts, userId } = props
    console.log(posts,'-----> posts')
    const handleDeletePost = (id, type) => {
        console.log('deletePost',id,type)
        props.dispatch(startDeletePost(id,type))
    }
    return(
        <div>
            {posts?.map(post => {
                return <PostCardItem 
                    key={post._id} 
                    post={post} 
                    userId={userId} 
                    handleDeletePost={handleDeletePost}
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

