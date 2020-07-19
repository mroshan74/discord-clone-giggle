import React, { useState } from 'react'
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
import './PostCardItem.css'

function PostCardItem(props) {
    const { post } = props
    const [openEdit, setOpenEdit] = useState(false)
    const [like, setLike] = useState(0)
    const [dislike, setDislike] = useState(0)
    const handleEditPostModal= () => {
        setOpenEdit(!openEdit)
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
                    <FormControl id="postCardItem-select">
                        <Select
                        disableUnderline={true}
                        value={post.postType}
                        readOnly
                        displayEmpty
                        >
                            <MenuItem value={'Private'}><BsLockFill/></MenuItem>
                            <MenuItem value={'Friends'}><FaUserFriends/></MenuItem>
                            <MenuItem value={'Public'}><MdPublic/></MenuItem>
                        </Select>
                    </FormControl>
                    <button id='postCardItem-edit' onClick={handleEditPostModal}><FiEdit/></button>
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
