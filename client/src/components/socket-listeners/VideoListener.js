import React, { Fragment, useEffect, useState } from 'react'
import socket from '../../services/socket'
import CallModal from '../reusables/CallModal'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { saveSignal } from '../../redux/actions/callAction'
import { v4 as uuidv4} from 'uuid'


function VideoListener(props) {

    const [viewCall, setViewCall] = useState(false)
    const [callerName, setCallerName] = useState('')
    const [callerPic, setCallerPic] = useState('')
    const [dataPack, setDataPack] = useState({})
    const [attend, setAttend] = useState(false)
    const [query, setQuery] = useState('')

    const modalStatus = () => {
        setViewCall(false)
    }

    const handleAttendCall = () => {
        setAttend(true)
    }

    const handleRejectCall = () => {
        socket.emit('rejectCall', {
            from: dataPack.from
        })
    }

    useEffect(()=>{
        socket.on('call listener', (data) => {
            console.log('[VIDEO-SIGNAL]', data)
            const pack = {
                from: data.from,
                signal: data.signal,
            }
            const callId = uuidv4()
            props.dispatch(saveSignal(pack))
            const path = `/users/videocall?from=${data.from}&uid=${callId}&receiving=true&attend=true`
            setQuery(path)
            setViewCall(true)
            setDataPack(pack)
            setCallerName(data.username)
            setCallerPic(data.profilePicUrl)
        })
        //console.log('[APP-STATE]',dataPack)
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

export default connect()(VideoListener)
