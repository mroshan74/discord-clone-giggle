import React, { useEffect, useState, useRef } from 'react'
import Peer from 'simple-peer'
import { useHistory } from 'react-router-dom'
import socket from '../../services/socket'
import './VideoCall.css'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { IoIosCall } from 'react-icons/io'
import CallAlertModal from '../reusables/CallAlertModal'
import { callStateClear, appStateInCallInitiate } from '../../redux/actions/callAction'
import classNames from 'classnames'

function VideoCall(props) {
  const userVideo = useRef()
  const partnerVideo = useRef()
  const history = useHistory()
  let getStreamRef = null
  let callEnd = useRef(false)
  let callEngaged = useRef(false)

  const [viewCall, setViewCall] = useState(true)
  const [stream, setStream] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [callerSignal, setCallerSignal] = useState()
  const [caller, setCaller] = useState('')

  const [offline, setOffline] = useState(false)
  const [offlineMsg, setOfflineMsg] = useState('')
  //const [callEnd, setCallEnd] = useState(false)

  const modalStatus = () => {
    setViewCall(false)
  }

  const { user, callState } = props
  const signal = callState.signal
  //let receiverId = selectedChat?.info._id
  let receiverId = props.match.params.id
  console.log('params id -->', receiverId)
  let userId = user?._id
  const query = queryString.parse(props.location.search, {
    parseBooleans: true,
  })
  console.log(query, 'incoming-call query')

  const handleCallEndBtn = () => {
    socket.emit('endCallByUser', {
      user: user._id,
    })
    callEnd.current = true
    //setCallEnd(true)
    setTimeout(() => {
      history.push('/users/chat')
    }, 1500)
  }

  const videoCssEle = classNames('clientVideo', {
    'clientVideo-accepted': callAccepted,
  })

  const isReceiving = callState?.callReceiving
  //const isInitiator = callState?.callInitiator
  function closeStream() {
    console.log('streamVideo closed', getStreamRef)
    if (getStreamRef) {
      getStreamRef.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.stop()
        }
      })
    }
    console.log(
      '[***INIT**]',
      receiverId,
      userId,
      isReceiving,
      '[CALL-END] -->',
      callEnd.current
    )

    if (!callEngaged.current) {
      if (!callEnd.current) {
        if (receiverId) {
          //console.log('INSIDE CLOSING CALL CONNECTION CHANNEL --> [receiver]')
          socket.emit('connectionClosed', {
            to: receiverId,
            from: userId,
          })
        } else if (isReceiving) {
          //console.log('INSIDE CLOSING CALL CONNECTION CHANNEL --> [caller]',signal.from)
          socket.emit('connectionClosed', {
            to: signal.from,
            from: userId,
          })
        }
      }
    }

    callEnd.current = false
    callEngaged.current = false
    props.dispatch(callStateClear())
  }

  useEffect(() => {
    console.log(receiverId, '--->RID')

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream) // eslint-disable-next-line
        getStreamRef = stream
        if (userVideo.current) {
          userVideo.current.srcObject = stream
        }
        // 🔥 https://stackoverflow.com/questions/11642926stop-close-webcam-which-is-opened-by-navigator-getusermedia
        // 🔥 https://developers.google.com/web/updates/2015/07/mediastream-deprecationshl=en#stop-ended-and-active
        if (query.receiving) {
          setCallerSignal(signal.signal)
          setCaller(signal.from)
          console.log('[EFFECT-SET-RECEIVING-CALL]', caller, callerSignal)
        }
      })
      .catch((err) => {
        console.log(err)
        history.push('/users/chat')
      })

    return () => {
      closeStream()
      socket.off('connectionClosed')
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    console.log('++++++++++++++++++++++++++++++++++++CallPEER', receiverId)
    if (receiverId) {
      props.dispatch(appStateInCallInitiate(true))
      function callPeer(id) {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream,
        })

        const serverEndCall = (data) => {
          peer.destroy()
          console.log('data fail', data)
          setTimeout(() => {
            setOfflineMsg(data.message)
            setOffline(true)
          }, 2000) // prev --> 5000
        }

        peer.on('signal', (data) => {
          socket.emit('callUser', {
            userToCall: receiverId,
            signalData: data,
            from: userId,
          })
        })

        peer.on('stream', (stream) => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream
          }
        })

        socket.on('callAccepted', (signal) => {
          setCallAccepted(true)
          console.log('accepted signal', signal)
          peer.signal(signal)
        })

        socket.on('not-reachable', serverEndCall)
        socket.on('callRejected', serverEndCall)
        socket.on('call-disconnected', serverEndCall)
        socket.on('callChannelClosed', serverEndCall)
        socket.on('callClosedByUser', serverEndCall)

        socket.on('caller engaged', (data) => {
          peer.destroy()
          console.log('data fail', data)
          setTimeout(() => {
            setOfflineMsg(data.message)
            setOffline(true)
            callEngaged.current = true
          }, 2000) // prev --> 5000
        })
      }
      callPeer(receiverId)

      return () => {
        socket.off('callAccepted')
        socket.off('callRejected')
        socket.off('not-reachable')
        socket.off('call-disconnected')
        socket.off('callChannelClosed')
        socket.off('callClosedByUser')
        socket.off('caller engaged')
      }
    } // eslint-disable-next-line
  }, [stream, userId, receiverId, query.connectId])

  useEffect(() => {
    if (query.attend && caller && query.connectId) {
      function acceptCall() {
        setCallAccepted(true)
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        })

        const serverEndCall = (data) => {
          peer.destroy()
          console.log('data fail', data)
          setTimeout(() => {
            setOfflineMsg(data.message)
            setOffline(true)
          }, 2000) // prev 5000
        }

        peer.on('signal', (data) => {
          socket.emit('acceptCall', { signal: data, to: caller, from: userId })
        })

        peer.on('stream', (stream) => {
          partnerVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)

        socket.on('callChannelClosed', serverEndCall)
        socket.on('callClosedByUser', serverEndCall)
      }
      acceptCall()
    }

    return () => {
      socket.off('callChannelClosed')
      socket.off('callClosedByUser')
    } // eslint-disable-next-line
  }, [callerSignal, stream, caller, userId, query.connectId])

  let ClientVideo
  if (stream) {
    ClientVideo = (
      <video
        className={videoCssEle}
        playsInline
        muted
        ref={userVideo}
        autoPlay
      />
    )
  }

  let PartnerVideo
  if (callAccepted) {
    PartnerVideo = (
      <video controls id='partnerVideo' ref={partnerVideo} autoPlay />
    )
  }

  return (
    <div id='v-call-container'>
      {offline && (
        <CallAlertModal
          view={viewCall}
          modalStatus={modalStatus}
          message={offlineMsg}
        />
      )}
      <div id='call-video-box'>
        <div>{ClientVideo}</div>
        <div>{PartnerVideo}</div>
      </div>
      <button
        id='call-end'
        onClick={() => {
          handleCallEndBtn()
        }}
      >
        <IoIosCall />
      </button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.login,
    selectedChat: state.selectedChat,
    callState: state.call,
  }
}

export default connect(mapStateToProps)(VideoCall)
