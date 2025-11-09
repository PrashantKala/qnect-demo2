"use client"; 

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { Phone, PhoneOff, Loader2, MessageCircle } from 'lucide-react';
import ChatModal from '../../components/ChatModal';

const SOCKET_SERVER_URL = 'https://qnect-backend.onrender.com'; // NEW
export default function CallPage() {
  const params = useParams();
  const { qrId } = params;

  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState('');
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // ▼▼▼ FIX 1: Store the app's socket ID ▼▼▼
  const remoteSocketIdRef = useRef(null);
  // ▲▲▲ FIX 1 ▲▲▲

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Chat event listeners
    socket.on('receive-message', (data) => {
      console.log("[Chat] Received message:", data);
      setMessages(prev => [...prev, {
        id: Math.random(),
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        timestamp: data.timestamp,
        isOwn: false
      }]);
    });

    socket.on('chat-history', (data) => {
      console.log("[Chat] Received chat history:", data.messages);
      const formattedMessages = data.messages.map(msg => ({
        id: msg._id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: msg.content,
        timestamp: msg.createdAt,
        isOwn: false
      }));
      setMessages(formattedMessages);
      setIsLoadingChat(false);
    });

    socket.on('chat-history-error', (data) => {
      console.error("[Chat] Error loading chat history:", data);
      setIsLoadingChat(false);
    });

    // Acks/errors for send
    socket.on('message-sent', (ack) => {
      console.log('[Chat] message-sent ack:', ack);
    });
    socket.on('message-error', (err) => {
      console.error('[Chat] message-error:', err);
    });

    // Resolve owner by qrId for chat (works even before a call connects)
    if (qrId) {
      socket.emit('search-user-by-qr', { qrId });
    }

    socket.on('user-search-result', (data) => {
      if (data?.found && data?.userId) {
        setOwnerUserId(data.userId);
        // If user already opened chat and no messages loaded, request history now
        if (showChat && messages.length === 0 && currentUserId) {
          setIsLoadingChat(true);
          socketRef.current.emit('request-chat-history', {
            userId: currentUserId,
            recipientId: data.userId
          });
        }
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

  // Load chat history when chat is opened
  const handleOpenChat = () => {
    setShowChat(true);
    // If owner not yet resolved, trigger lookup now
    if (!ownerUserId && qrId && socketRef.current) {
      setIsLoadingChat(true);
      socketRef.current.emit('search-user-by-qr', { qrId });
      // Retry the lookup once after a short delay if still not found
      setTimeout(() => {
        if (!ownerUserId && socketRef.current?.connected) {
          console.log('[Chat] Retrying owner lookup...');
          socketRef.current.emit('search-user-by-qr', { qrId });
        }
      }, 1200);
      return; // wait for user-search-result to request history
    }
    if (ownerUserId && currentUserId && messages.length === 0) {
      setIsLoadingChat(true);
      socketRef.current.emit('request-chat-history', {
        userId: currentUserId,
        recipientId: ownerUserId
      });
    }
  };

  // Send message
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    if (!ownerUserId || !currentUserId) {
      console.warn('[Chat] Missing ownerUserId or currentUserId; cannot send yet.');
      return;
    }

    setMessageInput('');

    // Add message to local state
    setMessages(prev => [...prev, {
      id: Math.random(),
      senderId: currentUserId,
      senderName: 'You',
      content: trimmed,
      timestamp: new Date().toISOString(),
      isOwn: true
    }]);

    // Send to server
    socketRef.current.emit('send-message', {
      senderUserId: currentUserId,
      recipientId: ownerUserId,
      senderName: 'You',
      content: trimmed
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

            {callStatus === 'connected' && (
              <button 
                onClick={handleOpenChat}
                className="w-full mt-4 flex items-center justify-center gap-2 px-10 py-3 bg-primary-blue text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle size={20} /> Open Chat
              </button>
            )}

            {/* Chat button for non-app users (always visible) */}
            {callStatus !== 'calling' && callStatus !== 'connected' && (
              <button 
                onClick={handleOpenChat}
                className="w-full mt-3 flex items-center justify-center gap-2 px-10 py-3 bg-accent-cyan text-primary-blue font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle size={20} /> Chat with Owner
              </button>
            )}

            <p className="text-xs text-gray-400 mt-6">
              Your phone number is 100% private. This call is connected securely over the internet.
            </p>
          </div>
        </div>

        {/* Chat Modal */}
        <ChatModal
          open={showChat}
          title="Chat with Owner"
          messages={messages}
          isLoading={isLoadingChat}
          messageInput={messageInput}
          onChangeMessage={setMessageInput}
          onSend={handleSendMessage}
          onClose={() => setShowChat(false)}
          sendDisabled={!ownerUserId || !currentUserId}
        />
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </main>
  );
}