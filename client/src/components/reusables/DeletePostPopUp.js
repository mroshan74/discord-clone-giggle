import React from 'react'
import Popover from '@material-ui/core/Popover'
import { AiOutlineDelete } from 'react-icons/ai'
import './DeletePostPopUp.css'

export default function DeletePostPopUp(props) {
  
  const { anchorEl, handleClose, handleDeletePost, post} = props

  const open = Boolean(anchorEl)
  const id = open ? 'DeletePostPopUp' : undefined

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div id='postDelete-pop-container'>
          <p>Are you sure ?</p>
          <button onClick={
            () => {
                    let postId = null
                    if(post.postType === 'Public'){
                        postId = post.publicPostId || post._id
                    }else if(post.postType === 'Friends'){
                        postId = post.friendPostId || post._id
                    }else {
                      postId = post._id
                    }
                    handleDeletePost(postId,post.postType)
                    handleClose()
                  }
          }><AiOutlineDelete/></button>
        </div>
      </Popover>
    </div>
  )
}
