import React, { useState, Fragment } from 'react'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { BsLockFill } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'
import { GrLike } from 'react-icons/gr'
import { GrDislike } from 'react-icons/gr'
import { GoCommentDiscussion } from 'react-icons/go'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import './PostCardItem.css'
import DeletePostPopUp from './DeletePostPopUp'

function PostCardItem(props) {
    const { post, userId, handleDeletePost } = props
    const [openEdit, setOpenEdit] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const deletePostPop = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleDelPostPopClose = () => {
        setAnchorEl(null)
    }
    const handleEditPostModal= () => {
        setOpenEdit(!openEdit)
    }
    let editPost = null 
    if(post?.createdBy._id === userId){
        editPost = (
            <Fragment>
                <button id='postCardItem-edit' onClick={handleEditPostModal}><FiEdit/></button>
                <button id='postCardItem-delete' onClick={
                    (e) => {deletePostPop(e)}}><AiOutlineDelete/></button>
                    {anchorEl && <DeletePostPopUp 
                            anchorEl={anchorEl} 
                            post= {post} 
                            handleDeletePost={handleDeletePost}
                            handleClose= {handleDelPostPopClose}
                        />}
            </Fragment>
        )
    }
    
    return(
        <div id='postCardItem-container'>
            <div id='postCardItem-title'>
                <Avatar id='postCardItem-avatar' src={post.createdBy.profilePicUrl} />
                <div id='postCardItem-userDate'>
                    <h4>{post.createdBy.username}</h4>
                    <p>{moment(post.createdAt).format('LLL')}</p>
                </div>
                <div id='postCardItem-miniAct'>
                    <FormControl id="postCardItem-control">
                        <Select
                        disableUnderline={true}
                        value={post.postType}
                        readOnly
                        displayEmpty
                        >
                            <MenuItem id='"postCardItem-select' value={'Private'}><BsLockFill/></MenuItem>
                            <MenuItem id='"postCardItem-select' value={'Friends'}><FaUserFriends/></MenuItem>
                            <MenuItem id='"postCardItem-select' value={'Public'}><MdPublic/></MenuItem>
                        </Select>
                    </FormControl>
                    {editPost}
                </div>
            </div>
            <hr/>
            <div id='postCardItem-post'>
                {post.uploadPath && <img src={post.uploadPath} alt={post._id}/>}
                <p>{post.post}</p>
            </div>
            <hr/>
            <div id='postCardItem-action'>
                <button ><GrLike/><span>{post.isLiked.length}</span></button>
                <button><GrDislike/><span>{post.isDisliked.length}</span></button>
                <button><GoCommentDiscussion/><span>{post.comments.length}</span></button>
            </div>
        </div>
    )
}

export default PostCardItem
