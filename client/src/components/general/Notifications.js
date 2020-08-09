import React from 'react'
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
                <h2>No Notifications for you at the moment</h2>
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
