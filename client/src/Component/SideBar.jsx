import React, { useEffect, useRef, useState } from "react";
import socket from "../Context/socket";
import { MoreVertical, Search, LogOut, MessageSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUserData } from "../Redux/Features/userSlice";

export default function SideBar({ setSelectedUser, unRead }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const menuRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        socket.emit("users:get");
        socket.on("users:update", (data) => setUsers(data));

        return () => {
            socket.off("users:update");
        };
    }, []);

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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        user.socketId !== socket.id
    );

    function formatChatTime(time) {
        if (!time) return "";
        const date = new Date(time);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        return date.toLocaleDateString();
    };

    function toggleMenu() {
        setMenuOpen(!menuOpen)
    }

    function handleLogOut() {
        dispatch(clearUserData())
    }

    return (
        <div className="w-full h-full glassmorphism-dark border-r border-white/10 flex flex-col text-white shadow-2xl z-10">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedUser(null)}>
                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/40 transition-colors">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        CHATLY
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={toggleMenu}
                        className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
                    >
                        <MoreVertical className="w-5 h-5 text-white/70" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 glassmorphism-dark rounded-xl border border-white/10 shadow-2xl py-2 animate-fade-in z-50">
                            <button
                                onClick={handleLogOut}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Box */}
            <div className="p-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => (
                        <div
                            key={item.socketId}
                            onClick={() => setSelectedUser(item)}
                            className="group relative flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all active:scale-[0.98]"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-primary/20 transition-all">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1a1c23] rounded-full shadow-sm"></div>
                            </div>

                            {/* Name & Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                                        {item.name}
                                    </h3>
                                    {unRead[item.socketId]?.time && (
                                        <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                                            {formatChatTime(unRead[item.socketId].time)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-white/40 truncate">
                                        Click to start chatting...
                                    </p>
                                    {unRead[item.socketId]?.count > 0 && (
                                        <div className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-primary rounded-full text-[10px] font-bold text-white shadow-lg shadow-primary/20 animate-bounce">
                                            {unRead[item.socketId].count}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20">
                        <Search className="w-10 h-10 mb-2" />
                        <p className="text-sm font-medium">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
