import React, { Fragment } from 'react'
import { connect } from 'react-redux'

function Notifications(props) {

    const { notifications } = props

    const notifyList = (
        <div>
            {notifications.map(notify => {
                return <p key={notify._id}>{notify.message}</p>
            })}
        </div>
    )
    return (
        <div>
            {
                notifications.length ? (notifyList) :
                <h3>No Notifications for you at the moment</h3>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        notifications: state.login.notifications
    }
}

export default connect(mapStateToProps)(Notifications)
