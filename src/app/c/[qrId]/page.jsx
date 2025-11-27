"use client"; 

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { Phone, PhoneOff, Loader2, Bell, AlertTriangle, Camera, X, MapPin } from 'lucide-react';
import { fetchQRGuardians, sendEmergencyAlert } from '../../../../lib/api';

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

  // Emergency Connect state
  const [showEmergency, setShowEmergency] = useState(false);
  const [guardians, setGuardians] = useState([]);
  const [loadingGuardians, setLoadingGuardians] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    description: '',
    phoneNumber: '',
    media: [], // Array of { file, preview, base64 }
    selectedGuardianId: null,
    includeLocation: true, // Default to true
    location: null
  });
  const [sendingEmergency, setSendingEmergency] = useState(false);
  const [locationError, setLocationError] = useState(null);

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

  // Emergency Connect Handlers
  const handleOpenEmergency = async () => {
    setShowEmergency(true);
    setLoadingGuardians(true);
    
    // Try to get location immediately when opening
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyForm(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          }));
          setLocationError(null);
        },
        (err) => {
          console.warn("Location access denied or failed", err);
          setLocationError("Location access denied. Enable it to share your location.");
          setEmergencyForm(prev => ({ ...prev, includeLocation: false }));
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setEmergencyForm(prev => ({ ...prev, includeLocation: false }));
    }

    try {
      const res = await fetchQRGuardians(qrId);
      setGuardians(res.data.guardians || []);
    } catch (err) {
      console.error("Failed to fetch guardians", err);
      setError("Could not load emergency contacts.");
    } finally {
      setLoadingGuardians(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmergencyForm(prev => ({
          ...prev,
          media: [...prev.media, {
            file,
            preview: URL.createObjectURL(file),
            base64: reader.result // This includes the data:image/...;base64, prefix
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (index) => {
    setEmergencyForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const [alertSent, setAlertSent] = useState(false); // New state for success view
  const [callingGuardianId, setCallingGuardianId] = useState(null);

  const handleCallGuardian = async (guardian) => {
    if (!guardian.userId) {
      // Fallback to phone call if guardian is not a registered user
      window.location.href = `tel:${guardian.phoneNumber}`;
      return;
    }

    setCallingGuardianId(guardian._id);
    setCallStatus('calling');
    setError('');
    setShowEmergency(false); // Close modal to show main call UI

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
          console.log("Generated offer for guardian, sending to server...");
          socketRef.current.emit('app-call-user', {
            targetUserId: guardian.userId,
            offer: offer,
            callerName: 'Emergency Contact',
            callerId: 'web-user', // Anonymous web user
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
        setCallingGuardianId(null);
      });

      peer.on('error', (err) => {
        console.error("Peer error:", err);
        setError('A connection error occurred.');
        setCallStatus('failed');
        cleanup();
        setCallingGuardianId(null);
      });

      // Listen for answer (app-call-answered)
      socketRef.current.on('app-call-answered', (data) => {
        console.log("Call answered by guardian");
        setCallStatus('connected');
        remoteSocketIdRef.current = data.fromSocketId;
        peerRef.current.signal(data.answer);
      });

      // Listen for ICE candidates (app-ice-candidate)
      socketRef.current.on('app-ice-candidate', (data) => {
        if (peerRef.current && peerRef.current._pc) {
          peerRef.current._pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      });

    } catch (err) {
      console.error("Failed to get mic:", err);
      setError('Microphone permission is required to make a call.');
      setCallStatus('failed');
      setCallingGuardianId(null);
    }
  };

  const handleSendEmergency = async () => {
    if (emergencyForm.media.length === 0) {
      alert("Please add at least one photo or video of the situation.");
      return;
    }

    setSendingEmergency(true);
    try {
      await sendEmergencyAlert({
        qrId,
        description: emergencyForm.description,
        phoneNumber: emergencyForm.phoneNumber,
        media: emergencyForm.media.map(m => ({
          base64: m.base64,
          type: m.file.type
        })),
        guardianId: null, // Send to all
        location: emergencyForm.includeLocation ? emergencyForm.location : null
      });
      setAlertSent(true); // Switch to success view
      setSuccess("Emergency alert sent to guardians successfully.");
    } catch (err) {
      console.error("Emergency alert failed", err);
      alert("Failed to send emergency alert. Please try again.");
    } finally {
      setSendingEmergency(false);
    }
  };
  
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

            {/* Emergency Connect button (always available) */}
            <button 
              onClick={handleOpenEmergency}
              className="w-full mt-4 flex items-center justify-center gap-2 px-10 py-3 bg-white text-red-600 border-2 border-red-600 font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-50 hover:-translate-y-0.5"
            >
              <AlertTriangle size={20} /> Emergency Connect
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

        {/* Emergency Connect Modal */}
        {showEmergency && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg my-8 flex flex-col max-h-[90vh]">
              <div className="p-4 border-b flex items-center justify-between bg-red-50 rounded-t-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={24} />
                  <h3 className="text-xl font-bold">Emergency Connect</h3>
                </div>
                <button onClick={() => { setShowEmergency(false); setAlertSent(false); }} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {loadingGuardians ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
                ) : guardians.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                      <AlertTriangle size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-700 mb-2">Owner didn't select any guardian</h4>
                    <p className="text-gray-500">This user has not set up any emergency contacts yet.</p>
                    <button onClick={() => setShowEmergency(false)} className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium">
                      Close
                    </button>
                  </div>
                ) : alertSent ? (
                  <div className="text-center py-4">
                    <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                      <div className="text-green-600 text-4xl">✓</div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Alert Sent!</h4>
                    <p className="text-gray-600 mb-6">Guardians have been notified with your details.</p>
                    
                    <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                      <h5 className="font-bold text-gray-700 mb-3 border-b pb-2">Quick Connect</h5>
                      <div className="space-y-3">
                        {guardians.map((g) => (
                          <div key={g._id} className="flex items-center justify-between bg-white p-3 rounded border shadow-sm">
                            <div>
                              <div className="font-bold text-gray-800">{g.name}</div>
                              <div className="text-sm text-gray-500">{g.relation}</div>
                            </div>
                            <button 
                              onClick={() => handleCallGuardian(g)}
                              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                            >
                              <Phone size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button onClick={() => { setShowEmergency(false); setAlertSent(false); }} className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold">
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. Media Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">1. Share Situation (Required)</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {emergencyForm.media.map((m, idx) => (
                          <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                            <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => handleRemoveMedia(idx)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <Camera size={24} className="text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>

                    {/* 2. Share Location */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">2. Share Location</label>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <MapPin size={20} className={emergencyForm.includeLocation ? "text-blue-500" : "text-gray-400"} />
                          <div>
                            <div className="font-medium text-gray-800">Include Current Location</div>
                            {locationError ? (
                              <div className="text-xs text-red-500">{locationError}</div>
                            ) : emergencyForm.location ? (
                              <div className="text-xs text-green-600">
                                Lat: {emergencyForm.location.latitude.toFixed(4)}, Long: {emergencyForm.location.longitude.toFixed(4)}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">Fetching location...</div>
                            )}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={emergencyForm.includeLocation}
                            onChange={(e) => setEmergencyForm({...emergencyForm, includeLocation: e.target.checked})}
                            disabled={!!locationError}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* 3. Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">3. Describe Situation (Optional)</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                        rows="3"
                        placeholder="What is happening?"
                        value={emergencyForm.description}
                        onChange={(e) => setEmergencyForm({...emergencyForm, description: e.target.value})}
                      />
                    </div>

                    {/* 4. Phone Number */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">4. Your Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
                        placeholder="So they can call you back"
                        value={emergencyForm.phoneNumber}
                        onChange={(e) => setEmergencyForm({...emergencyForm, phoneNumber: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={handleSendEmergency}
                      disabled={sendingEmergency}
                      className="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sendingEmergency ? (
                        <><Loader2 className="animate-spin" /> Sending Alert...</>
                      ) : (
                        <><AlertTriangle size={20} /> INFORM GUARDIANS</>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </main>
  );
}