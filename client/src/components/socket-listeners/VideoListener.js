import React, { Fragment, useEffect, useState } from 'react'
import socket from '../../services/socket'
import CallModal from '../reusables/CallModal'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { saveSignal, appStateInCallReceiving, callStateClear } from '../../redux/actions/callAction'


function VideoListener(props) {

    const [viewCall, setViewCall] = useState(false)
    const [callerName, setCallerName] = useState('')
    const [callerPic, setCallerPic] = useState('')
    const [dataPack, setDataPack] = useState({})
    const [attend, setAttend] = useState(false)
    const [query, setQuery] = useState('')

    const { callState } = props
    const inCallReceiving = callState?.callReceiving

    const modalStatus = () => {
        setViewCall(false)
    }

    const handleAttendCall = () => {
        setAttend(true)
    }

    const handleRejectCall = () => {
        props.dispatch(callStateClear())
        socket.emit('rejectCall', {
            from: dataPack.from
        })
    }

    const videoSignalData = (data) => {
        console.log('[VIDEO-SIGNAL]', data)
        const pack = {
            from: data.from,
            signal: data.signal,
        }
        props.dispatch(saveSignal(pack))
        if(!callState.callInitiator){
            props.dispatch(appStateInCallReceiving(true))
            if(!inCallReceiving){
                setViewCall(true)
            }
        }
        setDataPack(pack)
        setCallerName(data.username)
        setCallerPic(data.profilePicUrl)

        //if(attend){
            const path = `/users/videoCall?from=${data.from}&connectId=${data.connect_id}&receiving=true&attend=true`
            setQuery(path)
        //}
    }

    const videoCallListener = () => {
        console.log('VideoCall listener fn() loaded')
        socket.on('call listener', videoSignalData)
    }

    useEffect(()=>{
        videoCallListener()
        return() => {
            console.log('VideoCall listening closed')
            socket.off('call listener',videoSignalData)
            if(attend){
                setAttend(false)
                setViewCall(false)
            }
        }
    })

    return (
        <div>
            <Fragment>
                { (viewCall && !attend) &&
                    <CallModal 
                        modalStatus={modalStatus}
                        view={viewCall} 
                        name={callerName} 
                        pic={callerPic}
                        handleAttendCall={handleAttendCall}
                        handleRejectCall={handleRejectCall}
                    /> }
                { attend && 
                    <Redirect to={query}/>
                }
            </Fragment>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        callState : state.call
    }
}

export default connect(mapStateToProps)(VideoListener)
