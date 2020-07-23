import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Avatar from '@material-ui/core/Avatar'
import './PostCreate.css'
import PostModal from '../reusables/PostModal'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { BsLockFill } from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { MdPublic } from 'react-icons/md'
import { GrEmoji } from 'react-icons/gr'
import EmojiPopUp from '../reusables/EmojiPopUp'
import { startCreateNewPost } from '../../redux/actions/postsAction'

export function AddPost(props){

    const { user, handleDrop, fileUp, post, pType, handleClearFileUpload, handlePassPostData, handleSubmit } = props
    
    const [postType, setPostType] = useState('Private')
    const [postText, setPostText] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [lineHeight,setLineHeight] = useState('')


    useEffect(() => {
        if(post){
            setPostType(pType)
            setPostText(post)
        }
        // eslint-disable-next-line
    },[])

    //console.log(!postText.length,!Boolean(fileUp),'check disabled')

    const handleEmojiPopOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleEmojiPopClose = (e) => {
        setAnchorEl(null)
    }

    const handleAddEmoji = (e) => {
        setPostText(postText+e.native)
    }

    const handlePostTextChange = (e) => {
        setPostText(e.target.value)
        //console.log(e.target)
        setLineHeight(e.target.scrollHeight)
    }

    useEffect(
        () => {
            handlePassPostData(postText,postType)
            // eslint-disable-next-line
        },[postText,postType])

    return(
        <div id='add-post-container'>
            <h1>Create post</h1>
            <hr/>
            <div id='add-ava-user'>
                <Avatar id='post-avatar' src={user.profileImg} />
                <div id='add-post-type'>
                    <h4>{user.username}</h4>
                    <FormControl >
                        <Select
                        id="select-post-type"
                        value={postType}
                        onChange={(e)=>{setPostType(e.target.value)}}
                        displayEmpty
                        >
                            <MenuItem value={'Private'}><BsLockFill/>Only me</MenuItem>
                            <MenuItem value={'Friends'}><FaUserFriends/>Friends</MenuItem>
                            <MenuItem value={'Public'}><MdPublic/>Public</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            {fileUp && (
                <div id='add-file-up'>
                    <img  src={URL.createObjectURL(fileUp)} alt='fileUp'/>
                    <button id='add-file-up-close' onClick={handleClearFileUpload}>X</button>
                </div>
            ) }
            <div id='add-post-wrapper'>
                <textarea
                    id='add-post-text'
                    style={{height:`${lineHeight}px`}} 
                    type="text" 
                    value={postText}
                    placeholder={`Whats on your mind,${user.username} ?`}
                    onChange={handlePostTextChange}
                    />
                <GrEmoji id='add-input-emoji' onClick={(e) => {handleEmojiPopOpen(e)}}/>
                {anchorEl && 
                    <EmojiPopUp 
                        anchorEl={anchorEl} 
                        handleClose={handleEmojiPopClose} 
                        handleAddEmoji={handleAddEmoji} 
                    />}
            </div>
                
            <hr/>
            <div id='add-post-action'>
                <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div id='img-up-btn'>
                                    <img src={require('../../resources/icons/imageUpload.png')} alt='imgUpIcon' />
                                </div>
                            </div>
                            </section>
                        )}
                </Dropzone>
                <button id='add-post-btn' onClick={handleSubmit} disabled={!postText.length && !Boolean(fileUp)}>Post</button>
            </div>
        </div>
    )
}

function PostCreate(props) {

    const { user } = props

    const [modalView, setModalView] = useState(false)
    const [file, setFile] = useState(null)
    const [post, setPost] = useState('')
    const [postType, setPostType] = useState('Private')
    

    const handlePostSubmit = () => {
        console.log('[SUBMIT]',post,postType,file)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('post',post)
        fd.append('postType',postType)
        props.dispatch(startCreateNewPost(fd))
        handlePostModal()
        setFile(null)
        setPost('')
        setPostType('Private')
    }

    const handleClearFileUpload = () => {
        setFile(null)
    }

    const handlePassPostData = (post,type) => {
        setPost(post)
        setPostType(type)
    }

    const handleDrop = (file) => {
        // const fd = new FormData()
        // fd.append('file', file[0])
        // fd.append('type','image/video')
        setFile(file[0])
        if(!modalView){
            setModalView(!modalView)
        }
    }

    const handlePostModal = () => {
        setModalView(!modalView)
    }

    return (
        <div id='create-post-container'>
            {modalView && <PostModal 
                modalStatus={modalView}
                handleModalStatus={handlePostModal}
                addPost={
                    <AddPost 
                        handleDrop={handleDrop} 
                        user={user} 
                        fileUp={file}
                        post={post}
                        pType={postType}
                        handleClearFileUpload={handleClearFileUpload}
                        handlePassPostData={handlePassPostData}
                        handleSubmit={handlePostSubmit}
                    />}
                />}
            <div id='ava-input'>
                <Avatar id='post-avatar' src={user.profileImg} />
                <input id='input-post' type="text" placeholder={`Whats on your mind,${user.username} ?`} readOnly onClick={handlePostModal}/>
            </div>
            <hr/>
            <div id='post-action'>
                <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div id='img-up-btn'>
                                <img src={require('../../resources/icons/imageUpload.png')} alt='imgUpIcon' />
                                Image</div>
                            </div>
                            </section>
                        )}
            </Dropzone>
            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        user: state.login
    }
}
export default connect(mapStateToProps)(PostCreate)
