import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import './MessageModal.css'

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

export default function MessageModal(props) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const { message, modalStatus } = props

    const handleOpen = () => {
        setOpen(modalStatus)
    }

    useState(handleOpen,[])

    const handleClose = () => {
        setOpen(false)
        props.handleModalStatus()
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
            <div className={classes.paper}>
                <img className='modal-img' src={message.message} alt={message._id} />
            </div>
        </Fade>
        </Modal>
    </div>
    )
}
