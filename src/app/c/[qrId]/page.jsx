"use client"; 

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { Phone, PhoneOff, Loader2, Bell } from 'lucide-react';

const SOCKET_SERVER_URL = 'https://qnect-backend.onrender.com'; // NEW
export default function CallPage() {
  const params = useParams();
  const { qrId } = params;

  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState('');
  
  // Notify Owner state
  const [showNotify, setShowNotify] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const TEMPLATES = [
    'Your car is blocking mine, please move it.',
    'Parking alert: You are parked in a no-parking zone.',
    'Your headlights are on.',
    'Your window is open.',
    'Your car alarm is going off.',
    'You left your trunk open.',
    'Please return to your vehicle.',
    'Urgent: Your car needs to be moved immediately.',
    'You are double-parked.',
    'Emergency: Please contact me regarding your car.'
  ];
  
  // ▼▼▼ FIX 1: Store the app's socket ID ▼▼▼
  const remoteSocketIdRef = useRef(null);
  // ▲▲▲ FIX 1 ▲▲▲

  // (Chat removed)

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    const socket = socketRef.current;

    // Get current user ID from localStorage or session
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'guest-' + Math.random().toString(36).substr(2, 9);
    setCurrentUserId(userId);

    socket.on('call-answered', (data) => {
      console.log("Call answered by app");
      setCallStatus('connected');
      
      // ▼▼▼ FIX 2: Save the app's socket ID so we can hang up ▼▼▼
      remoteSocketIdRef.current = data.fromSocketId;
      
      // Store owner user ID for chat
      if (data.userId) {
        setOwnerUserId(data.userId);
      }
      // ▲▲▲ FIX 2 ▲▲▲

      peerRef.current.signal(data.answer);
    });

    socket.on('ice-candidate', (data) => {
      if (peerRef.current && peerRef.current._pc) {
        peerRef.current._pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on('call-failed', (data) => {
      console.log("Call failed:", data.message);
      setError(data.message);
      setCallStatus('failed');
      cleanup();
    });

    socket.on('hang-up', () => {
      console.log("Owner hung up.");
      setCallStatus('idle');
      setError('The owner ended the call.');
      cleanup();
    });

    // Notify acks/errors
    socket.on('notify-sent', (ack) => {
      console.log('[Notify] notify-sent:', ack);
      setSuccess('Owner has been notified.');
      setShowNotify(false);
    });
    socket.on('notify-error', (err) => {
      console.error('[Notify] notify-error:', err);
      setError(err?.message || 'Failed to notify owner');
    });

    // Resolve owner by qrId for chat (works even before a call connects)
    if (qrId) {
      socket.emit('search-user-by-qr', { qrId });
    }

    socket.on('user-search-result', (data) => {
      if (data?.found && data?.userId) {
        setOwnerUserId(data.userId);
        // no-op for chat (removed)
      }
    });

    socket.on('user-search-failed', (payload) => {
      console.warn('[Chat] Owner lookup failed:', payload?.message);
    });

    return () => {
      console.log("Cleaning up call page.");
      cleanup();
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleCall = async () => {
    // ... (This function remains the same as before)
    setCallStatus('calling');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      localStreamRef.current = stream;
      const peer = new SimplePeer({
        initiator: true,
        trickle: true,
        stream: stream,
      });
      peerRef.current = peer;
      peer.on('signal', (offer) => {
        if (offer.type === 'offer') {
          console.log("Generated offer, sending to server...");
          socketRef.current.emit('call-user', {
            qrId: qrId,
            offer: offer,
            callerName: 'Website User', // Send caller name for notifications
          });
        }
      });
      peer.on('stream', (remoteStream) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play();
        }
      });
      peer.on('close', () => {
        console.log("Peer connection closed.");
        cleanup();
        setCallStatus('idle');
      });
      peer.on('error', (err) => {
        console.error("Peer error:", err);
        setError('A connection error occurred.');
        setCallStatus('failed');
        cleanup();
      });
    } catch (err) {
      console.error("Failed to get mic:", err);
      setError('Microphone permission is required to make a call.');
      setCallStatus('failed');
    }
  };

  const cleanup = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };
  
  // ▼▼▼ FIX 3: Update the hangup function ▼▼▼
  const handleHangUp = () => {
    console.log("Website hanging up...");
    cleanup(); // Clean up our local peer
    setCallStatus('idle');
    setSuccess('Call ended.'); // Give user feedback
    
    // Tell the app we are hanging up
    if (socketRef.current && remoteSocketIdRef.current) {
      socketRef.current.emit('hang-up', { toSocketId: remoteSocketIdRef.current });
    }
  };
  // ▲▲▲ FIX 3 ▲▲▲

  // Open Notify Owner modal
  const handleOpenNotify = () => {
    setShowNotify(true);
    if (!ownerUserId && qrId && socketRef.current) {
      socketRef.current.emit('search-user-by-qr', { qrId });
    }
  };

  const handleSendNotify = (templateText) => {
    if (!ownerUserId || !socketRef.current) {
      setError('Owner not resolved yet. Please try again.');
      return;
    }
    socketRef.current.emit('notify-owner', {
      recipientId: ownerUserId,
      source: 'web',
      qrId,
      templateText,
      senderName: 'Website User',
    });
  };

  // ... (The rest of the file, renderButton(), and return() remain the same)
  
  const [success, setSuccess] = useState(''); // Add a success state

  const renderButton = () => {
    switch (callStatus) {
      case 'idle':
        return (
          <button onClick={handleCall} className="w-full text-lg flex items-center justify-center gap-2 px-10 py-4 bg-accent-cyan text-primary-blue font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90">
            <Phone size={24} /> Call Vehicle Owner
          </button>
        );
      case 'calling':
        return (
          <button disabled className="w-full text-lg flex items-center justify-center gap-2 px-10 py-4 bg-gray-300 text-gray-500 font-bold rounded-lg shadow-md cursor-not-allowed">
            <Loader2 size={24} className="animate-spin" /> Calling...
          </button>
        );
      case 'connected':
        return (
          <button onClick={handleHangUp} className="w-full text-lg flex items-center justify-center gap-2 px-10 py-4 bg-red-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <PhoneOff size={24} /> Hang Up
          </button>
        );
      case 'failed':
         return (
          <button onClick={handleCall} className="w-full text-lg flex items-center justify-center gap-2 px-10 py-4 bg-accent-cyan text-primary-blue font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90">
            <Phone size={24} /> Try Call Again
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Call Section */}
        <div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-primary-blue mb-2">Contact Owner</h1>
            <p className="text-text-secondary mb-6">You are about to securely call the owner of QR Code:</p>
            <p className="font-mono text-sm text-gray-500 bg-gray-100 rounded p-2 mb-8 break-all">{qrId}</p>
            
            {renderButton()}

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-600 text-center mt-4">{success}</p>}

            {/* Notify Owner button (always available) */}
            <button 
              onClick={handleOpenNotify}
              className="w-full mt-4 flex items-center justify-center gap-2 px-10 py-3 bg-primary-blue text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Bell size={20} /> Notify Owner
            </button>

            <p className="text-xs text-gray-400 mt-6">
              Your phone number is 100% private. This call is connected securely over the internet.
            </p>
          </div>
        </div>

        {/* Notify Owner Modal */}
        {showNotify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Quick Messages</h3>
                <button onClick={() => setShowNotify(false)} className="text-gray-500">✕</button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Select a message to notify the owner:</p>
              <div className="max-h-80 overflow-auto space-y-2">
                {TEMPLATES.map((t, idx) => (
                  <button key={idx} onClick={() => handleSendNotify(t)} className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </main>
  );
}