import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Generate UUID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Extract first 5-6 words from text for title
const generateTitle = (text) => {
  const words = text.trim().split(/\s+/).slice(0, 6).join(" ");
  return words.length > 0 ? words : "Untitled Chat";
};

// Get user-specific storage key
const getUserStorageKey = (user) => {
  if (!user || !user.email) return "sagacity_chats_guest";
  return `sagacity_chats_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

export const useChatManager = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Load chats from localStorage when user changes or on mount
  useEffect(() => {
    const storageKey = getUserStorageKey(user);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setChats(parsed);
        // Set active chat to most recent if no active chat
        if (parsed.length > 0 && !activeChatId) {
          setActiveChatId(parsed[0].id);
        }
      } catch (error) {
        console.error("Failed to load chats from localStorage:", error);
      }
    } else {
      // Clear chats if no stored data for this user
      setChats([]);
      setActiveChatId(null);
    }
  }, [user]); // Re-run when user changes

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      const storageKey = getUserStorageKey(user);
      localStorage.setItem(storageKey, JSON.stringify(chats));
    }
  }, [chats, user]);

  // Get active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || {
    id: generateId(),
    title: "New Chat",
    messages: [],
    createdAt: new Date().toISOString(),
  };

  // Create new chat
  const newChat = useCallback(() => {
    const newChatObj = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setActiveChatId(newChatObj.id);
    setChats((prev) => [newChatObj, ...prev]);
  }, []);

  // Add message to active chat
  const addMessage = useCallback(
    (role, content) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChatId) {
            const updatedMessages = [...(chat.messages || []), { role, content }];
            // Auto-generate title from first user message
            let title = chat.title;
            if (
              title === "New Chat" &&
              role === "user" &&
              updatedMessages.length === 1
            ) {
              title = generateTitle(content);
            }
            return {
              ...chat,
              title,
              messages: updatedMessages,
            };
          }
          return chat;
        })
      );
    },
    [activeChatId]
  );

  // Save active chat (only if it has messages)
  const saveActiveChat = useCallback(() => {
    const chat = chats.find((c) => c.id === activeChatId);
    if (!chat) return;

    // Don't save empty chats
    if (!chat.messages || chat.messages.length === 0) {
      setChats((prev) => prev.filter((c) => c.id !== activeChatId));
      return;
    }

    // Already in state, just ensure it's saved to localStorage
    const storageKey = getUserStorageKey(user);
    localStorage.setItem(storageKey, JSON.stringify(chats));
  }, [chats, activeChatId, user]);

  // Select a chat
  const selectChat = useCallback((id) => {
    setActiveChatId(id);
  }, []);

  // Rename a chat
  const renameChat = useCallback((id, newTitle) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
  }, []);

  // Delete a chat
  const deleteChat = useCallback((id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [chats, activeChatId]);

  // Sort chats by most recent
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  return {
    chats: sortedChats,
    activeChat,
    activeChatId,
    newChat,
    addMessage,
    saveActiveChat,
    selectChat,
    renameChat,
    deleteChat,
  };
};
