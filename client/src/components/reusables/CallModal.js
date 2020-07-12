import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

import './CallModal.css'

const useStyles = makeStyles((theme) => ({
modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
},
paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
},
}))

export default function CallModal(props) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const { view, modalStatus, name, pic, handleAttendCall, handleRejectCall } = props

    const handleOpen = () => {
        setOpen(view)
    }

    useState(handleOpen, [])

    const handleClose = () => {
        setOpen(false)
    }

    return (
    <div>
        <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
        >
        <Fade in={open}>
            <div id='call-modal' className={classes.paper}>
                <img id='call-img' src={require('../../styles/assets/calling.gif')} alt='calling' />

                <div id='caller'>
                    <img id='caller-avatar' src={pic} alt='name' />
                    <h3 id='caller-name'>{name}</h3>
                </div>
                <div id='call-btns'>
                    <button id='acc-call' onClick={()=> {
                        modalStatus()
                        handleAttendCall()
                        }}>Accept</button>
                    <button id='rej-call' onClick={() => {
                        handleRejectCall()
                        modalStatus()
                    }}>Reject</button>
                </div>
            </div>
        </Fade>
        </Modal>
    </div>
    )
}
