import React, { useEffect, useState, useRef, useMemo } from 'react'
import Peer from 'simple-peer'
import { useHistory } from 'react-router-dom'
import socket from '../../services/socket'
import './VideoCall.css'
import { connect } from 'react-redux'
import IncomingCall from './IncomingCall'

function VideoCall(props) {
    
    const userVideo = useRef()
    const partnerVideo = useRef()
    const history = useHistory()
    
    const [stream, setStream] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callerSignal, setCallerSignal] = useState()
    const [caller, setCaller] = useState('')
    const [callStatus, setCallStatus] = useState(false)
    const [callerInfo, setCallerInfo] = useState({})

    const { user, selectedChat } = props
    let receiverId = selectedChat?.info._id
    let callerId = user?._id

    useEffect(() => {
        let closeStream = null
        console.log(receiverId,'--->RID')
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((video) => {
            setStream(video)
            if (userVideo.current) {
            userVideo.current.srcObject = video
            }
            // 🔥 https://stackoverflow.com/questions/11642926/stop-close-webcam-which-is-opened-by-navigator-getusermedia
            // 🔥 https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en#stop-ended-and-active
            closeStream = () => {
                console.log('streamVideo closed')
                video.getTracks().forEach(track => {
                    if(track.readyState === 'live'){
                        track.stop()
                    }
                })
            }
            socket.on('call listener', (data) => {
                console.log('[VIDEO-SIGNAL]', data)
                setCallStatus(true)
                setCaller(data.from)
                setCallerSignal(data.signal)
                const info = {
                    callerName: data.username,
                    callerPic: data.profilePicUrl
                }
                setCallerInfo(info)
            })
        }).catch(err => {
            console.log(err)
            history.push('/users/chat')
        })
    
        return() => {
            closeStream()
        }
        // eslint-disable-next-line
    },[])

    useMemo(() => {
        console.log('++++++++++++++++++++++++++++++++++++CallPEER')
        if(receiverId){
            function callPeer(id) {
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream,
                })

                peer.on('signal', (data) => {
                socket.emit('callUser', {
                        userToCall: receiverId,
                        signalData: data,
                        from: callerId,
                    })
                })

                peer.on('stream', (stream) => {
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = stream
                    }
                })

                socket.on('callAccepted', (signal) => {
                    setCallAccepted(true)
                    console.log('accepted signal',signal)
                    peer.signal(signal)
                })
            }
            callPeer(receiverId)
        }
    },[receiverId, stream, callerId])

    function acceptCall(){
        setCallStatus(false)
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        
        peer.on('signal', (data) => {
            socket.emit('acceptCall', { signal: data, to: caller })
        })

        peer.on('stream', (stream) => {
            partnerVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
    }

    let ClientVideo
    if (stream) {
        ClientVideo = <video id='clientVideo' playsInline muted ref={userVideo} autoPlay />
    }
    
    let PartnerVideo
    if (callAccepted) {
        PartnerVideo = <video ref={partnerVideo} autoPlay />
    }

    console.log('callStatus -->' ,callStatus)
    console.log('callAccepted -->' ,callAccepted)

    let ModalPopUp
    if(callStatus && !callAccepted){
        //console.log('insider---------->')
        ModalPopUp = <IncomingCall
                acceptCall={acceptCall}
                {...callerInfo}
                //callStatus={callStatus}
            />
    }

    return (
    <div>
        {ClientVideo}
        {PartnerVideo}
        {ModalPopUp}
    </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.login,
        selectedChat: state.selectedChat
    }
}

export default connect(mapStateToProps)(VideoCall)
