"use client";

import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { useChatManager } from "@/components/useChatManager";
import { useAuth } from "@/context/AuthContext";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const { user, isLoggedIn, isLoading: authLoading, signOut } = useAuth();
  const chatManager = useChatManager();
  const { chats, activeChat, activeChatId, newChat, addMessage, saveActiveChat, selectChat, renameChat, deleteChat } = chatManager;

  // Redirect to home if not logged in (only after auth is loaded)
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn, authLoading]);

  // Handle AI response streaming
  const handleFinish = useCallback((message) => {
    addMessage("assistant", message);
    setStreamingMessage("");
    setIsLoading(false);
  }, [addMessage]);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  // Submit user message
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      addMessage("user", input.trim());
      setInput("");
      setIsLoading(true);
      setIsThinking(true);

      try {
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input.trim() })
        });
        const data = await response.json();
        setIsThinking(false);
        if (data.error) throw new Error(data.error);
        if (data.fallback) {
          setStreamingMessage("🔧 *Using fallback response - API temporarily unavailable*\n\n" + data.reply);
        } else {
          setStreamingMessage(data.reply);
        }
        setTimeout(() => { handleFinish(data.reply); }, 500);
      } catch (error) {
        setIsThinking(false);
        const errorMessage = "🔧 *Connection issue - using fallback response*\n\n" +
          "I'm having trouble connecting to my AI assistant right now. Here's some general guidance:\n\n" +
          "• For emergencies, call 911 immediately\n" +
          "• For non-emergency health questions, consult your healthcare provider\n" +
          "• Consider telemedicine options for convenient consultations\n" +
          "• Stay hydrated and get adequate rest\n\n" +
          "*This is not medical advice - please consult a healthcare professional.*";
        setStreamingMessage(errorMessage);
        setTimeout(() => { handleFinish(errorMessage); }, 500);
      }
    },
    [input, isLoading, addMessage, handleFinish]
  );

  // New chat button
  const handleNewChat = useCallback(() => {
    saveActiveChat();
    newChat();
    setStreamingMessage("");
    setInput("");
  }, [saveActiveChat, newChat]);

  // Sidebar chat selection
  const handleSelectChat = useCallback((id) => {
    saveActiveChat();
    selectChat(id);
    setStreamingMessage("");
    setInput("");
  }, [saveActiveChat, selectChat]);

  // Sidebar rename
  const handleRenameChat = useCallback((id, newTitle) => {
    renameChat(id, newTitle);
  }, [renameChat]);

  // Sidebar delete
  const handleDeleteChat = useCallback((id) => {
    deleteChat(id);
  }, [deleteChat]);

  // Handle sign out
  const handleSignOut = () => {
    setShowLogoutConfirm(true);
  };

  const confirmSignOut = () => {
    signOut();
    setShowLogoutConfirm(false);
    window.location.href = "/";
  };

  // Only save chats with messages
  useEffect(() => {
    if (activeChat && activeChat.messages && activeChat.messages.length === 0) return;
    saveActiveChat();
  }, [activeChat, saveActiveChat]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback for unauthenticated users
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-4 text-lg">Please sign up first to use our chat service!</p>
          <p className="text-gray-500 mb-6">Create an account to start chatting with our AI health assistant.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
            >
              Back to Homepage
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelect={handleSelectChat}
        onNewChat={handleNewChat}
        onRename={handleRenameChat}
        onDelete={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-blue-500/20 px-6 py-4 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Health Assistant</h2>
              <p className="text-sm text-blue-400">Powered by Sagacity AI</p>
              {user && (
                <p className="text-xs text-gray-400 mt-1">
                  Chatting as: <span className="text-blue-300 font-medium">{user.fullName || user.username}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-gray-800/50 text-gray-300 text-sm rounded-lg hover:bg-gray-700/50 hover:text-white transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back to Homepage
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600/20 text-red-400 text-sm rounded-lg hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ChatWindow messages={activeChat?.messages || []} />
          {isThinking && !streamingMessage && (
            <div className="mb-6 flex justify-start animate-slideIn">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
                  <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-gray-800/90 text-gray-100 backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {streamingMessage && !isThinking && (
            <div className="mb-6 flex justify-start animate-slideIn">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-gray-800/90 text-gray-100 backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10 animate-bubbleAppear">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streamingMessage}
                    <span className="inline-block w-0.5 h-4 bg-blue-400 ml-1 animate-blink"></span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-blue-500/20 px-6 py-4 bg-gray-900/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask me anything about your health..."
                  className="w-full px-5 py-4 pr-12 bg-gray-800/50 border border-blue-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                  rows={1}
                  style={{ minHeight: "56px", maxHeight: "200px" }}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Sagacity AI can make mistakes. Please verify important health information with healthcare professionals.
            </p>
          </form>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-blue-950 border border-blue-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-400">
                Do you really want to sign out? You'll need to sign in again to access your chats.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800/50 text-white font-semibold rounded-lg hover:bg-gray-700/50 transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bubbleAppear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-bubbleAppear {
          animation: bubbleAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s step-start infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
