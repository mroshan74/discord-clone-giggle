import React, { useState, Fragment } from 'react'
import CallModal from '../../components/reusables/CallModal'

function IncomingCall(props) {

    const { acceptCall, callerPic, callerName, callStatus } = props

    const [viewCall, setViewCall] = useState(true)

    const modalStatus = () => {
        setViewCall(false)
    }

    return (
        <div>
            <Fragment>
                { viewCall && 
                <CallModal 
                    modalStatus={modalStatus}
                    view={viewCall} 
                    name={callerName} 
                    pic={callerPic}
                    handleAcceptCall={acceptCall}
                /> }
            </Fragment>
        </div>
    )
}

export default IncomingCall
