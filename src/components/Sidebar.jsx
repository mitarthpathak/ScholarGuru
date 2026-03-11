import React, { useState } from "react";

export default function Sidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renamingValue, setRenamingValue] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  // Start renaming
  const handleStartRename = (id, currentTitle, e) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenamingValue(currentTitle);
  };

  // Confirm rename
  const handleConfirmRename = (id, e) => {
    e?.stopPropagation?.();
    if (renamingValue.trim()) {
      onRename(id, renamingValue.trim());
    }
    setRenamingId(null);
    setRenamingValue("");
  };

  // Cancel rename
  const handleCancelRename = (e) => {
    e?.stopPropagation?.();
    setRenamingId(null);
    setRenamingValue("");
  };

  // Handle key press in rename input
  const handleRenameKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleConfirmRename(id);
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  // Delete chat
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="w-64 bg-gray-950/80 border-r border-blue-500/20 flex flex-col backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats && chats.length > 0 ? (
          <div className="p-3 space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onMouseEnter={() => setHoveredId(chat.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect(chat.id)}
                className={`relative group cursor-pointer transition-all duration-200 rounded-lg px-4 py-3 ${
                  activeChatId === chat.id
                    ? "bg-blue-600/40 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "hover:bg-gray-800/50 border border-transparent hover:border-blue-500/20"
                }`}
              >
                {/* Rename Mode */}
                {renamingId === chat.id ? (
                  <div
                    className="flex gap-2 items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={renamingValue}
                      onChange={(e) => setRenamingValue(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                      onBlur={() => handleConfirmRename(chat.id)}
                      autoFocus
                      className="flex-1 px-2 py-1 bg-gray-800 border border-blue-500/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={(e) => handleConfirmRename(chat.id, e)}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelRename}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Normal Display */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.messages && chat.messages.length > 0
                          ? `${chat.messages.length} messages`
                          : "No messages"}
                      </p>
                    </div>

                    {/* Action Buttons (on hover) */}
                    {hoveredId === chat.id && (
                      <div className="ml-2 flex gap-1">
                        <button
                          onClick={(e) =>
                            handleStartRename(chat.id, chat.title, e)
                          }
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 rounded transition-colors"
                          title="Rename"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDelete(chat.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded transition-colors"
                          title="Delete"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <svg
              className="w-8 h-8 mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-xs">No chats yet</p>
            <p className="text-xs opacity-70 mt-1">Start a new chat to begin</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-blue-500/20 p-4">
        <div className="text-xs text-gray-500 text-center">
          <p>Sagacity AI</p>
          <p className="mt-1">Health Assistant</p>
        </div>
      </div>
    </div>
  );
}
