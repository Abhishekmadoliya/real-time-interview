import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const VideoCall = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const myId = useRef(Math.floor(Math.random() * 1000000));

  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ]
    });

    // Handle connection state changes
    peer.onconnectionstatechange = () => {
      console.log("Connection state:", peer.connectionState);
      setIsConnected(peer.connectionState === "connected");
    };

    // Handle ICE connection state changes
    peer.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peer.iceConnectionState);
    };

    return peer;
  };

  useEffect(() => {
    if (!roomId) {
      setError("Room ID is required");
      return;
    }

    const init = async () => {
      try {
        // Connect to socket server
        const socket = io("http://localhost:3000", { 
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5
        });
        socketRef.current = socket;

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);

        // Create and configure peer connection
        const peer = createPeerConnection();
        peerRef.current = peer;

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        // Handle incoming tracks
        peer.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { 
              roomId, 
              candidate: event.candidate 
            });
          }
        };

        // Join room
        socket.emit("join-room", { 
          roomId, 
          userId: myId.current 
        });

        // Handle other user connecting
        socket.on("user-connected", async (otherUserId) => {
          console.log("User connected:", otherUserId);
          
          // Only the user with the higher ID creates the offer
          if (myId.current > otherUserId && peer.signalingState === "stable") {
            try {
              const offer = await peer.createOffer();
              await peer.setLocalDescription(offer);
              socket.emit("offer", { roomId, offer });
            } catch (err) {
              console.error("Error creating offer:", err);
              setError("Failed to create connection offer");
            }
          }
        });

        // Handle incoming offer
        socket.on("offer", async ({ offer }) => {
          try {
            if (peer.signalingState !== "stable") {
              console.log("Ignoring offer in non-stable state");
              return;
            }

            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          } catch (err) {
            console.error("Error handling offer:", err);
            setError("Failed to handle incoming connection");
          }
        });

        // Handle incoming answer
        socket.on("answer", async ({ answer }) => {
          try {
            if (peer.signalingState === "stable") {
              console.log("Already in stable state, ignoring answer");
              return;
            }
            await peer.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        });

        // Handle incoming ICE candidates
        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            if (peer.remoteDescription) {
              await peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });

        // Handle socket disconnection
        socket.on("disconnect", () => {
          console.log("Disconnected from server");
          setIsConnected(false);
        });

      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to initialize video call");
      }
    };

    init();

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Live Interview Call</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">You</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full border-2 border-blue-500 rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {isConnected ? "Remote Participant" : "Waiting for participant..."}
          </h3>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            className="w-full border-2 border-green-500 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
