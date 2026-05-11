import React, { useEffect, useRef, useState } from "react";
import socket from "../Context/socket";
import { MoreVertical, Send, Paperclip, Smile, X, User, Info, MessageCircle } from "lucide-react";

export default function ChatWindow({ selectedUser, setSelectedUser, chatHistory, setUnRead }) {
    const [message, setMessage] = useState('');
    const inputRef = useRef()
    const bottomScrollRef = useRef(null)
    const menuRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        inputRef.current?.focus()
    }, [selectedUser]);

    useEffect(() => {
        setUnRead((prev) => {
            const updated = { ...prev }
            delete updated[selectedUser?.socketId]
            return updated
        })
    }, [selectedUser, chatHistory])

    useEffect(() => {
        bottomScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory])

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    function handleSendMessage() {
        if (!message.trim() || !selectedUser) return

        socket.emit('private:message', {
            to: selectedUser.socketId,
            message: message.trim()
        })

        setMessage('')
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen)
    }

    if (!selectedUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-transparent text-white/20 animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                    <MessageCircle className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-white/40 mb-2">Your Conversations</h2>
                <p className="text-white/20 max-w-xs text-center">
                    Select a user from the sidebar to start a secure, real-time conversation.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col glassmorphism overflow-hidden animate-fade-in">
            {/* Chat Header */}
            <div className="p-4 bg-white/5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedUser(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden"
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1a1c23] rounded-full shadow-sm"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white leading-tight">{selectedUser.name}</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white active:scale-95">
                        <Info className="w-5 h-5" />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button onClick={toggleMenu} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white active:scale-95">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 glassmorphism-dark rounded-2xl border border-white/10 shadow-2xl py-2 animate-slide-up z-50">
                                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-white/70 transition-colors">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">View Profile</span>
                                </button>
                                <div className="h-px bg-white/10 my-1 mx-2"></div>
                                <button 
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm font-medium">Close Chat</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-white/[0.02]">
                {chatHistory?.filter(item => item?.to === selectedUser.socketId || item?.from === selectedUser.socketId).map((item, index) => {
                    const isMe = item?.from === socket.id;
                    return (
                        <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-slide-up`}>
                            <div className={`group relative max-w-[80%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                <div className={`px-4 py-3 rounded-2xl shadow-xl text-sm leading-relaxed ${
                                    isMe 
                                    ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                                    : "glassmorphism text-white/90 rounded-tl-none border border-white/10 shadow-black/20"
                                }`}>
                                    {item?.message}
                                </div>
                                <span className={`text-[10px] font-medium text-white/30 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity px-1`}>
                                    {new Date(item?.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomScrollRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-4xl mx-auto flex items-end gap-3 glassmorphism-dark rounded-3xl p-2 pl-4 border border-white/10 shadow-2xl focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                    <button className="p-2.5 text-white/30 hover:text-white transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                        rows="1"
                        ref={inputRef}
                        placeholder="Type something amazing..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 py-2.5 resize-none max-h-32 custom-scrollbar text-sm"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button className="p-2.5 text-white/30 hover:text-white transition-colors">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className={`p-3 rounded-2xl transition-all shadow-lg ${
                            message.trim() 
                            ? "bg-primary text-white shadow-primary/40 hover:scale-105 active:scale-95" 
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
