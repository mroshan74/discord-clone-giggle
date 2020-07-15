import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { useHistory } from 'react-router-dom'

import { RiCloudOffLine } from 'react-icons/ri'
import './CallAlertModal.css'

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
    const { view, modalStatus, message } = props
    const history = useHistory()

    const handleOpen = () => {
        setOpen(view)
    }

    useState(handleOpen, [])

    const handleClose = () => {
        setOpen(false)
    }
    
    const handleRedirect = () => {
        history.push('/users/chat')
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
            <div id='call-alert-modal' className={classes.paper}>
                <RiCloudOffLine id='offline-icon'/>
                <h2>{message}</h2>
                <button id='close-alert' onClick={
                    () => {
                        modalStatus()
                        handleRedirect()
                    }
                }>Close</button>
            </div>
        </Fade>
        </Modal>
    </div>
    )
}
