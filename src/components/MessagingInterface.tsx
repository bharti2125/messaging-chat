"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type User = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy" | "away" | "brb";
  lastSeen?: string;
  isTyping?: boolean;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  reactions: Record<string, string[]>;
  isRead: boolean;
};

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
  },
  {
    id: "u2",
    name: "Sarah Miller",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "busy",
  },
  {
    id: "u3",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
  },
  {
    id: "u4",
    name: "Olivia Taylor",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: "away",
  },
  {
    id: "u5",
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "offline",
    lastSeen: "2 hours ago",
  },
  {
    id: "u6",
    name: "Emma Garcia",
    avatar: "https://i.pravatar.cc/150?img=23",
    status: "brb",
  },
  {
    id: "u7",
    name: "Daniel Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "online",
  },
  {
    id: "u8",
    name: "Sophia Martinez",
    avatar: "https://i.pravatar.cc/150?img=25",
    status: "online",
  },
  {
    id: "u9",
    name: "Ethan Brown",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "away",
  },
  {
    id: "u10",
    name: "Isabella Lee",
    avatar: "https://i.pravatar.cc/150?img=20",
    status: "offline",
    lastSeen: "1 day ago",
  },
];

const initialMessages: Record<string, Message[]> = {
  "u1-u2": [
    {
      id: "m1",
      senderId: "u2",
      receiverId: "u1",
      text: "Hey Alex! How are you doing with the project?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      reactions: { "👍": ["u1"] },
      isRead: true,
    },
    {
      id: "m2",
      senderId: "u1",
      receiverId: "u2",
      text: "Hi Sarah! I'm making good progress. Had some issues with the API but fixed them.",
      timestamp: new Date(Date.now() - 3600000),
      reactions: { "🎉": ["u2"] },
      isRead: true,
    },
    {
      id: "m3",
      senderId: "u2",
      receiverId: "u1",
      text: "Great to hear! Let me know if you need any help with the design part.",
      timestamp: new Date(Date.now() - 1800000),
      reactions: {},
      isRead: true,
    },
  ],

  "u1-u3": [
    {
      id: "m4",
      senderId: "u3",
      receiverId: "u1",
      text: "Have you reviewed my pull request yet?",
      timestamp: new Date(Date.now() - 900000),
      reactions: {},
      isRead: true,
    },
    {
      id: "m5",
      senderId: "u1",
      receiverId: "u3",
      text: "Just finished reviewing it. Looks good, just left a few minor comments.",
      timestamp: new Date(Date.now() - 600000),
      reactions: { "👌": ["u3"] },
      isRead: true,
    },
  ],

  "u1-u4": [
    {
      id: "m6",
      senderId: "u4",
      receiverId: "u1",
      text: "Are we still on for the team lunch tomorrow?",
      timestamp: new Date(Date.now() - 3600000 * 5),
      reactions: {},
      isRead: true,
    },
  ],

  "u1-u6": [
    {
      id: "m7",
      senderId: "u6",
      receiverId: "u1",
      text: "I'll be right back after my meeting with the client.",
      timestamp: new Date(Date.now() - 3600000 * 1),
      reactions: {},
      isRead: true,
    },
  ],
};

const currentUserId = "u1";

const emojiOptions = ["👍", "❤️", "😂", "😮", "😢", "🎉", "👌", "🔥"];

const statusOptions = [
  { value: "online", label: "Online", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-red-500" },
  { value: "away", label: "Away", color: "bg-yellow-500" },
  { value: "brb", label: "BRB", color: "bg-blue-500" },
  { value: "offline", label: "Offline", color: "bg-gray-400" },
];

const getChatId = (user1Id: string, user2Id: string): string => {
  return [user1Id, user2Id].sort().join("-");
};

export default function MessagingInterface() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [currentUserStatus, setCurrentUserStatus] =
    useState<User["status"]>("online");
  const [selectedUserId, setSelectedUserId] = useState<string | null>("u2"); // Default to first chat

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserId]);

  useEffect(() => {
    const allChats: Record<string, Message[]> = { ...initialMessages };

    users.forEach((user) => {
      if (user.id !== currentUserId) {
        const chatId = getChatId(currentUserId, user.id);
        if (!allChats[chatId]) {
          allChats[chatId] = [];
        }
      }
    });

    setMessages(allChats);
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        if (!typingUsers.includes(selectedUserId)) {
          setTypingUsers((prev) => [...prev, selectedUserId]);

          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((id) => id !== selectedUserId)
            );

            if (Math.random() > 0.5) {
              const randomMessages = [
                "Just checking in. How's your day going?",
                "Did you get a chance to review that document?",
                "I'm making good progress on my tasks!",
                "Quick question about the project timeline?",
                "Are you free for a call later today?",
                "Have you seen the latest updates?",
              ];

              addMessage(
                selectedUserId,
                currentUserId,
                randomMessages[
                  Math.floor(Math.random() * randomMessages.length)
                ]
              );
            }
          }, Math.random() * 5000 + 2000);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedUserId, typingUsers]);

  const addMessage = (senderId: string, receiverId: string, text: string) => {
    if (!text.trim()) return;

    const chatId = getChatId(senderId, receiverId);

    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId,
      receiverId,
      text,
      timestamp: new Date(),
      reactions: {},
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    setTimeout(() => {
      setMessages((prev) => {
        const updatedChat = [...prev[chatId]];
        const msgIndex = updatedChat.findIndex((msg) => msg.id === newMsg.id);
        if (msgIndex !== -1) {
          updatedChat[msgIndex] = { ...updatedChat[msgIndex], isRead: true };
        }
        return {
          ...prev,
          [chatId]: updatedChat,
        };
      });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUserId) {
      addMessage(currentUserId, selectedUserId, newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addReaction = (chatId: string, messageId: string, emoji: string) => {
    setMessages((prev) => {
      const updatedChat = [...prev[chatId]];
      const msgIndex = updatedChat.findIndex((msg) => msg.id === messageId);

      if (msgIndex !== -1) {
        const msg = updatedChat[msgIndex];
        const currentReactions = { ...msg.reactions };

        if (!currentReactions[emoji]) {
          currentReactions[emoji] = [currentUserId];
        } else if (!currentReactions[emoji].includes(currentUserId)) {
          currentReactions[emoji] = [...currentReactions[emoji], currentUserId];
        } else {
          currentReactions[emoji] = currentReactions[emoji].filter(
            (id) => id !== currentUserId
          );
          if (currentReactions[emoji].length === 0) {
            delete currentReactions[emoji];
          }
        }

        updatedChat[msgIndex] = { ...msg, reactions: currentReactions };
      }

      return {
        ...prev,
        [chatId]: updatedChat,
      };
    });

    setShowEmojiPicker(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const updateUserStatus = (status: User["status"]) => {
    setCurrentUserStatus(status);
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUserId ? { ...user, status } : user
      )
    );
  };

  const getUserById = (id: string) => {
    return (
      users.find((user) => user.id === id) || {
        id: "unknown",
        name: "Unknown User",
        avatar: "https://i.pravatar.cc/150?img=0",
        status: "offline",
      }
    );
  };

  const getStatusColor = (status: User["status"]) => {
    return (
      statusOptions.find((option) => option.value === status)?.color ||
      "bg-gray-400"
    );
  };

  const getCurrentChatMessages = () => {
    if (!selectedUserId) return [];
    const chatId = getChatId(currentUserId, selectedUserId);
    return messages[chatId] || [];
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUserId &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const TypingIndicator = () => (
  //   <div className="flex space-x-1">
  //     <div
  //       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
  //       style={{ animationDelay: "0ms" }}
  //     ></div>
  //     <div
  //       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
  //       style={{ animationDelay: "200ms" }}
  //     ></div>
  //     <div
  //       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
  //       style={{ animationDelay: "400ms" }}
  //     ></div>
  //   </div>
  // );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Personal Chat</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50"
                onClick={() => {
                  const dropdown = document.getElementById("status-dropdown");
                  dropdown?.classList.toggle("hidden");
                }}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(
                    currentUserStatus
                  )}`}
                ></span>
                {
                  statusOptions.find(
                    (option) => option.value === currentUserStatus
                  )?.label
                }
              </button>
              <div
                id="status-dropdown"
                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg hidden z-10"
              >
                <ul className="py-1">
                  {statusOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          updateUserStatus(option.value as User["status"]);
                          document
                            .getElementById("status-dropdown")
                            ?.classList.add("hidden");
                        }}
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${option.color}`}
                        ></span>
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <img
                src={getUserById(currentUserId).avatar}
                alt="Current user"
                className="w-8 h-8 rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-2 ring-white ${getStatusColor(
                  currentUserStatus
                )}`}
              ></span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-8 pr-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Online Users
            </h2>
            <div className="space-y-2">
              {filteredUsers
                .filter((user) => user.status !== "offline")
                .map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                      selectedUserId === user.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span
                        className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white ${getStatusColor(
                          user.status
                        )}`}
                      ></span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {typingUsers.includes(user.id) ? (
                          <span className="text-gray-500 italic">
                            typing...
                          </span>
                        ) : user.status === "brb" ? (
                          "Be right back"
                        ) : (
                          user.status
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <h2 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">
              Offline Users
            </h2>
            <div className="space-y-2">
              {filteredUsers
                .filter((user) => user.status === "offline")
                .map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer opacity-60 ${
                      selectedUserId === user.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.lastSeen
                          ? `Last seen ${user.lastSeen}`
                          : "Offline"}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              <div className="bg-white border-b border-gray-200 p-3 flex items-center">
                <div className="relative mr-3">
                  <img
                    src={getUserById(selectedUserId).avatar}
                    alt={getUserById(selectedUserId).name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full ring-1 ring-white ${getStatusColor(
                      getUserById(selectedUserId).status
                    )}`}
                  ></span>
                </div>
                <div>
                  <div className="font-medium">
                    {getUserById(selectedUserId).name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {typingUsers.includes(selectedUserId)
                      ? "typing..."
                      : getUserById(selectedUserId).status === "online"
                      ? "Online"
                      : getUserById(selectedUserId).status}
                  </div>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-gray-50"
              >
                <div className="space-y-4">
                  {getCurrentChatMessages().map((message) => {
                    const sender = getUserById(message.senderId);
                    const isCurrentUser = message.senderId === currentUserId;
                    const chatId = getChatId(currentUserId, selectedUserId);

                    return (
                      <div key={message.id} className="relative group">
                        <div
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isCurrentUser && (
                            <img
                              src={sender.avatar}
                              alt={sender.name}
                              className="w-8 h-8 rounded-full mr-2 mt-1"
                            />
                          )}
                          <div
                            className={`
                              relative max-w-md px-4 py-2 rounded-lg 
                              ${
                                isCurrentUser
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-800 border border-gray-200"
                              }
                            `}
                          >
                            <div>{message.text}</div>
                            <div
                              className={`text-xs mt-1 ${
                                isCurrentUser
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                              {isCurrentUser && (
                                <span className="ml-1">
                                  {message.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>

                            {Object.keys(message.reactions).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(message.reactions).map(
                                  ([emoji, users]) => (
                                    <div
                                      key={emoji}
                                      className="bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center"
                                      title={users
                                        .map((id) => getUserById(id).name)
                                        .join(", ")}
                                    >
                                      <span>{emoji}</span>
                                      <span className="ml-1">
                                        {users.length}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`absolute ${
                            isCurrentUser ? "left-0" : "right-0"
                          } bottom-0 opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          <button
                            className="p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                            onClick={() => setShowEmojiPicker(message.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>

                          {showEmojiPicker === message.id && (
                            <div
                              className={`absolute ${
                                isCurrentUser ? "left-0" : "right-0"
                              } bottom-8 bg-white rounded-lg shadow-lg p-2 z-10 border border-gray-200`}
                            >
                              <div className="flex flex-wrap gap-1 w-48">
                                {emojiOptions.map((emoji) => (
                                  <button
                                    key={emoji}
                                    className="p-1.5 hover:bg-gray-100 rounded"
                                    onClick={() =>
                                      addReaction(chatId, message.id, emoji)
                                    }
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {typingUsers.includes(selectedUserId) && (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center"
                      >
                        <img
                          src={getUserById(selectedUserId).avatar}
                          alt={getUserById(selectedUserId).name}
                          className="w-6 h-6 rounded-full mr-1"
                        />
                        <div className="bg-gray-100 rounded-full px-3 py-2">
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0,
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0.2,
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: 0.4,
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-gray-200 p-3 bg-white">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-lg px-3 pt-3 pb-2">
                    <textarea
                      className="w-full bg-transparent resize-none outline-none text-gray-800 min-h-[44px] max-h-32"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      rows={1}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        <button className="p-1 rounded hover:bg-gray-200 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">
                        {newMessage.length > 0 && "Press Enter to send"}
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={handleSendMessage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                        transform="rotate(90 12 12)"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
