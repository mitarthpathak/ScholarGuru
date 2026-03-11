# AGENTIC AI SYSTEM PROMPT FOR DYNAMIC CHAT SYSTEM

## OBJECTIVE
Fix the React chat application to replace hardcoded chat items with a dynamic,  localStorage-persisted chat history system. The sidebar should show ZERO default/placeholder chats - only user-created chats after they start messaging.

## CURRENT PROBLEM
- File: `d:\prototype sagacity\apps\web\src\app\chat\page.jsx` has broken JSX after partial edits
- Contains leftover old code (suggestedPrompts, messages state, hardcoded recentChats array)
- Still references `messages` state variable instead of using `activeChat?.messages`
- Contains SVG fragments and incomplete JSX rendering logic

## REQUIRED FILES (ALREADY CREATED - VERIFY EXIST)
1. `d:\prototype sagacity\apps\web\src\components\useChatManager.js` - Custom hook with localStorage
2. `d:\prototype sagacity\apps\web\src\components\Sidebar.jsx` - Sidebar component with chat list
3. `d:\prototype sagacity\apps\web\src\components\ChatWindow.jsx` - Message display component

## TASK: COMPLETELY REWRITE page.jsx

Replace the entire `d:\prototype sagacity\apps\web\src\app\chat\page.jsx` file with this exact code:

```jsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { useChatManager } from "@/components/useChatManager";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  
  const chatManager = useChatManager();
  const { chats, activeChat, activeChatId, newChat, addMessage, saveActiveChat, selectChat, renameChat, deleteChat } = chatManager;

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
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  // Only save chats with messages
  useEffect(() => {
    if (activeChat && activeChat.messages && activeChat.messages.length === 0) return;
    saveActiveChat();
  }, [activeChat, saveActiveChat]);

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
      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bubbleAppear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-bubbleAppear { animation: bubbleAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blink { animation: blink 1s step-start infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce { animation: bounce 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
```

## VERIFICATION CHECKLIST
After completing the replacement:

1. ✅ NO hardcoded default chats should appear in sidebar on first load
2. ✅ User types first message → chat auto-creates with auto-generated title
3. ✅ Chat appears in LHS sidebar immediately
4. ✅ Hover chat in sidebar → rename/delete icons appear
5. ✅ Click "New Chat" → current chat saves, fresh empty session opens
6. ✅ Refresh page → ALL previous chats restored from localStorage
7. ✅ Click chat in sidebar → loads that conversation
8. ✅ Rename chat → title updates immediately in sidebar
9. ✅ Delete chat → removed from sidebar & localStorage
10. ✅ Empty chats (0 messages) NOT saved to localStorage
11. ✅ Chats sorted by most recent activity
12. ✅ AI response flow works unchanged
13. ✅ No TypeScript/React errors in console

## TESTING FLOW
1. Open app → sidebar EMPTY (no placeholder chats)
2. Type "What helps with better sleep?" → chat created with title "What helps with better sleep?"
3. Get AI response → chat shows in sidebar
4. Type "New Chat" button → previous chat moves to sidebar list
5. Fresh empty chat opens with new UUID
6. Go back to first chat by clicking it in sidebar
7. All conversation history loads
8. Hover first chat → click pencil → rename to "Sleep Tips"  
9. Refresh browser F5 → all chats still there from localStorage
10. Hover second chat → click trash → chat deleted
11. Refresh → only one chat remains

## SUCCESS CRITERIA
- Sidebar shows 0 chats initially
- First user message creates chat automatically
- All chats persist in localStorage
- Rename/delete work perfectly
- No console errors
- Chat selection/switching works
- AI text generation continues without issues
