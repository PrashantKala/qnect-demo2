"use client";

import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function CallingScreen({
    callStatus,
    callerName = "Vehicle Owner",
    callDuration,
    isMuted,
    isSpeakerOn,
    onToggleMute,
    onToggleSpeaker,
    onHangUp
}) {
    // Format duration as MM:SS
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Don't show if idle or failed
    if (callStatus === 'idle' || callStatus === 'failed') {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-between h-full py-12 px-6 max-w-md mx-auto">
                {/* Top Section - Caller Info */}
                <div className="flex flex-col items-center mt-20">
                    {/* Animated Avatar */}
                    <div className="relative mb-8">
                        {callStatus === 'calling' && (
                            <>
                                {/* Pulsing rings */}
                                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            </>
                        )}
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                            <Phone size={48} className="text-white" />
                        </div>
                    </div>

                    {/* Caller Name */}
                    <h2 className="text-3xl font-bold text-white mb-2">{callerName}</h2>

                    {/* Call Status */}
                    <p className="text-blue-200 text-lg mb-4">
                        {callStatus === 'calling' && (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
                                Calling...
                            </span>
                        )}
                        {callStatus === 'connecting' && (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                                Connecting...
                            </span>
                        )}
                        {callStatus === 'connected' && (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span>
                                {formatDuration(callDuration)}
                            </span>
                        )}
                    </p>

                    {/* Connection status message */}
                    {callStatus === 'connecting' && (
                        <p className="text-sm text-blue-300 animate-pulse mt-2">
                            Establishing secure connection...
                        </p>
                    )}
                    {callStatus === 'connected' && (
                        <p className="text-sm text-green-300 mt-2">
                            ✓ Connected
                        </p>
                    )}
                </div>

                {/* Middle Section - Call Controls (only when connected) */}
                {callStatus === 'connected' && (
                    <div className="flex gap-6 mb-8">
                        {/* Mute Button */}
                        <button
                            onClick={onToggleMute}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isMuted
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                                }`}
                        >
                            {isMuted ? (
                                <MicOff size={24} className="text-white" />
                            ) : (
                                <Mic size={24} className="text-white" />
                            )}
                        </button>

                        {/* Speaker Button */}
                        <button
                            onClick={onToggleSpeaker}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isSpeakerOn
                                ? 'bg-white text-blue-900'
                                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white'
                                }`}
                        >
                            {isSpeakerOn ? (
                                <Volume2 size={24} />
                            ) : (
                                <VolumeX size={24} />
                            )}
                        </button>
                    </div>
                )}

                {/* Bottom Section - Hangup Button */}
                <div className="mb-12">
                    <button
                        onClick={onHangUp}
                        className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                    >
                        <PhoneOff size={32} className="text-white" />
                    </button>
                    <p className="text-white/70 text-sm mt-4 text-center">Hang Up</p>
                </div>

                {/* Subtle hint text */}
                {callStatus === 'calling' && (
                    <p className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-xs">
                        Calling securely over the internet
                    </p>
                )}
            </div>
        </div>
    );
}
