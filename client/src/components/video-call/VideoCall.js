import React, { useEffect, useState, useRef } from 'react'
import Peer from 'simple-peer'
import { useHistory } from 'react-router-dom'
import socket from '../../services/socket'
import './VideoCall.css'
import { connect } from 'react-redux'
import queryString from 'query-string'

function VideoCall(props) {
  const userVideo = useRef()
  const partnerVideo = useRef()
  const history = useHistory()
  let getStreamRef

  const [stream, setStream] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [callerSignal, setCallerSignal] = useState()
  const [caller, setCaller] = useState('')

  const { user, selectedChat, signal } = props
  let receiverId = selectedChat?.info._id
  let userId = user?._id
  const query = queryString.parse(props.location.search,{parseBooleans: true})
  console.log(query,'props-match')

  function closeStream(){
    console.log('streamVideo closed', getStreamRef, callAccepted)
    if (getStreamRef) {
      getStreamRef.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.stop()
        }
      })
    }
  }

  useEffect(() => {
    //let closeStream = null
    console.log(receiverId, '--->RID')

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        getStreamRef = stream
        if (userVideo.current) {
          userVideo.current.srcObject = stream
        }

        // 🔥 https://stackoverflow.com/questions/11642926/stop-close-webcam-which-is-opened-by-navigator-getusermedia
        // 🔥 https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en#stop-ended-and-active

        // closeStream = () => {
        //   console.log('streamVideo closed')
        //   stream.getTracks().forEach((track) => {
        //     if (track.readyState === 'live') {
        //       track.stop()
        //     }
        //   })
        // }

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
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    console.log('++++++++++++++++++++++++++++++++++++CallPEER')
    if (receiverId) {
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
            from: userId,
          })
        })

        peer.on('stream', (stream) => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream
          }
        })

        peer.on('close', () => {
          setCallAccepted(false)
          alert('user disconnected')
        })

        socket.on('callAccepted', (signal) => {
          setCallAccepted(true)
          console.log('accepted signal', signal)
          peer.signal(signal)
        })

        socket.on('not-reachable',(data) => {
          alert(data.message)
          history.push('/users/chat')
        })

        // socket.on('callRejected',(data) => {
        //   alert(data.message)
        //   peer.destroy()
        //   history.push('/users/chat')
        // })

        socket.on('caller engaged',(data) =>{
          alert(data.message)
          //peer.destroy()
          //history.push('/users/chat')
        })

        // socket.on('call-disconnected',(data)=>{
        //   alert(data.message)
        //   peer.destroy()
        //   history.push('/users/chat')
        // })
      }
      callPeer(receiverId)

      return () => {
        socket.off('callAccepted')
        //socket.off('callRejected')
        socket.off('not-reachable')
        socket.off('caller engaged')
        //socket.off('call-disconnected')
      }
    }
  }, [stream,userId,receiverId,query.uid])

  useEffect(() => {
    if (query.attend && caller && query.uid) {
      function acceptCall() {
        setCallAccepted(true)
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        })

        peer.on('signal', (data) => {
          socket.emit('acceptCall', { signal: data, to: caller, from: userId })
        })

        peer.on('stream', (stream) => {
          partnerVideo.current.srcObject = stream
        })

        peer.on('close', () => {
          setCallAccepted(false)
          alert('user disconnected')
          peer.destroy()
          //history.push('/users/chat')
        })

        peer.signal(callerSignal)
      }
      acceptCall()
    }
  }, [callerSignal,stream,caller, userId])

  let ClientVideo
  if (stream) {
    ClientVideo = (
      <video id='clientVideo' playsInline muted ref={userVideo} autoPlay />
    )
  }

  let PartnerVideo
  if (callAccepted) {
    PartnerVideo = <video id='partnerVideo' ref={partnerVideo} autoPlay />
  }

  return (
    <div>
      {ClientVideo}
      {PartnerVideo}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.login,
    selectedChat: state.selectedChat,
    signal: state.call
  }
}

export default connect(mapStateToProps)(VideoCall)
