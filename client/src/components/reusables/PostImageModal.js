import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import './PostImageModal.css'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}))

export default function PostImageModal(props) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const { post, modalStatus } = props

    const handleOpen = () => {
        setOpen(modalStatus)
    }

    useState(handleOpen,[])

    const handleClose = () => {
        setOpen(false)
        props.openModalState()
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
            <div className='modal-img-container'>
                <img className='modal-img' src={post.uploadPath} alt={post._id} />
            </div>
        </Fade>
        </Modal>
    </div>
    )
}
