import React from 'react'
import Popover from '@material-ui/core/Popover'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

export default function EmojiPopUp(props) {
  
  const { anchorEl, handleClose, handleAddEmoji } = props

  const open = Boolean(anchorEl)
  const id = open ? 'EmojiPopUp' : undefined

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
          horizontal: 'left',
        }}
      >
        <Picker title='Pick your emoji…' emoji='point_up' onSelect={handleAddEmoji}/>
      </Popover>
    </div>
  )
}
