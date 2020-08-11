import React, { useState, Fragment,useRef } from 'react'
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
import { startDeletePost, startActionOnPost } from '../../redux/actions/postsAction'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import PostCreate from '../posts/PostCreate'
import PostImageModal from './PostImageModal'

function PostCardItem(props) {
    const { post, userId } = props
    const [openEdit, setOpenEdit] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const disableRef = useRef(false)

    const handleDeletePost = (id, type) => {
        console.log('deletePost',id,type)
        props.dispatch(startDeletePost(id,type))
    }
    const handlePostAction = (id,type,action) => {
        console.log('[POST-ACTION]  --> ',id,type,action)
        props.dispatch(startActionOnPost(id,type,action))
    }

    const deletePostPop = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleDelPostPopClose = () => {
        setAnchorEl(null)
    }
    const handleEditPostModal= () => {
        setIsEdit(!isEdit)
        setOpenEdit(!openEdit)
    }

    const openModalState = () => {
        setOpenModal(!openModal)
    }

    let editPost = null 
    if(post?.createdBy._id === userId){
        disableRef.current = true
        editPost = (
            <Fragment>
                <button id='postCardItem-edit' onClick={handleEditPostModal}><FiEdit/></button>
                {openEdit && <PostCreate editPost={post} isEdit={isEdit} handleEditPostModal={handleEditPostModal}/>}
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

    let selectedLike = '', selectedDislike = ''
    if(post.isLiked.find(id => id===userId)){
        selectedLike = 'postCardItem-btn-like-selected'
    }else if (post.isDisliked.find(id => id===userId)){
        selectedDislike = 'postCardItem-btn-dislike-selected'
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
                {post.uploadPath && <img src={post.uploadPath} alt={post._id} onClick={()=>{openModalState()}}/>}
                {openModal && <PostImageModal openModalState={openModalState} post={post} modalStatus={openModal}/>}
                <p>{post.post}</p>
            </div>
            <hr/>
            <div id='postCardItem-action'>
                <Button id={selectedLike} disabled={disableRef.current} onClick={
                    () => { 
                        let postId = post._id
                        // if(post.postType=== 'Public'){
                        //     postId = post.publicPostId || post._id
                        // }
                        handlePostAction(postId, post.postType, 'like') 
                    }
                }><GrLike/><span>{post.isLiked.length}</span></Button>

                <Button id={selectedDislike} disabled={disableRef.current} onClick={
                    () => { handlePostAction(post._id, post.postType, 'dislike') }
                }><GrDislike/><span>{post.isDisliked.length}</span></Button>

                <Button ><GoCommentDiscussion/><span>{post.comments.length}</span></Button>
            </div>
        </div>
    )
}

export default connect()(PostCardItem)
