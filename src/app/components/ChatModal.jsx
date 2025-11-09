"use client";

import { useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

export default function ChatModal({
  open,
  title = 'Chat with Owner',
  messages = [],
  isLoading = false,
  messageInput,
  onChangeMessage,
  onSend,
  onClose,
}) {
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, onSend]);

  // Click outside to close
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="chat-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-primary-blue text-white p-4 flex justify-between items-center">
          <h2 id="chat-modal-title" className="font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">Loading chat history...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 bg-white flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onChangeMessage?.(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
          <button
            onClick={onSend}
            disabled={!messageInput?.trim()}
            className="bg-primary-blue text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
