import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';

const Session = () => {
  const [isHR, setIsHR] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [socket, setSocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [remotePeerConnected, setRemotePeerConnected] = useState(false);
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Get user's video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = currentStream;
        }
      });

    return () => {
      if (socket) socket.disconnect();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const createSession = () => {
    const newSessionId = uuidv4();
    setIsHR(true);
    setSessionId(newSessionId);
    socket.emit('create-session', { sessionId: newSessionId, hrId: socket.id });
  };

  const joinSession = (sessionIdToJoin) => {
    setSessionId(sessionIdToJoin);
    socket.emit('join-session', { sessionId: sessionIdToJoin, candidateId: socket.id });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('session-created', ({ sessionId }) => {
      console.log('Session created:', sessionId);
    });

    socket.on('candidate-joined', ({ candidateId }) => {
      console.log('Candidate joined:', candidateId);
      // HR initiates the peer connection
      if (isHR) {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream
        });

        peer.on('signal', signal => {
          socket.emit('signal', { sessionId, signal, to: candidateId });
        });

        peer.on('stream', remoteStream => {
          remoteVideoRef.current.srcObject = remoteStream;
          setRemotePeerConnected(true);
        });

        setPeer(peer);
      }
    });

    socket.on('signal', ({ from, signal }) => {
      if (!isHR) {
        if (!peer) {
          const newPeer = new Peer({
            initiator: false,
            trickle: false,
            stream
          });

          newPeer.on('signal', signal => {
            socket.emit('signal', { sessionId, signal, to: from });
          });

          newPeer.on('stream', remoteStream => {
            remoteVideoRef.current.srcObject = remoteStream;
            setRemotePeerConnected(true);
          });

          newPeer.signal(signal);
          setPeer(newPeer);
        } else {
          peer.signal(signal);
        }
      } else if (peer) {
        peer.signal(signal);
      }
    });

    socket.on('session-ended', () => {
      setSessionId('');
      setRemotePeerConnected(false);
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
    });

    return () => {
      socket.off('session-created');
      socket.off('candidate-joined');
      socket.off('signal');
      socket.off('session-ended');
    };
  }, [socket, isHR, sessionId, stream, peer]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interview Session</h1>
      
      {!sessionId && (
        <div className="space-y-4">
          <button
            onClick={createSession}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Interview Session (HR)
          </button>
          <div>
            <input
              type="text"
              placeholder="Enter Session ID"
              className="border p-2 rounded mr-2"
              onChange={(e) => setSessionId(e.target.value)}
            />
            <button
              onClick={() => joinSession(sessionId)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Join Session
            </button>
          </div>
        </div>
      )}

      {sessionId && (
        <div className="mt-4">
          <p className="mb-2">Session ID: {sessionId}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Local Video</h2>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full bg-black rounded"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Remote Video</h2>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full bg-black rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
