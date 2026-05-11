import React, { useEffect, useRef, useState } from "react";
import socket from "../Context/socket";
import { MoreVertical } from "lucide-react";

export default function ChatWindow({ selectedUser, setSelectedUser, chatHistory, setUnRead }) {
    const [message, setMessage] = useState('');
    const inputRef = useRef()
    const bottomScrollRef = useRef(null)
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

    function handleSendMessage(event) {
        if (!message || !selectedUser) return

        // Send to server 
        socket.emit('private:message', {
            to: selectedUser.socketId,
            message
        })

        inputRef.current.value = ''
        setMessage('')
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen)
    }

    function toggleChatWindow() {
        setMenuOpen(false)
        setSelectedUser(null)
    }

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col ">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between">
                <div className="flex items-center gap-3 ">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="font-bold text-lg">{selectedUser.name}</h2>
                </div>

                <div className="relative flex justify-center items-center ">
                    <button onClick={toggleMenu} className=" select-none cursor-pointer">
                        <MoreVertical />
                    </button>

                    <button onClick={toggleChatWindow} className={`absolute right-0 top-10 p-2 text-nowrap text-white bg-gray-700 border rounded-md ${menuOpen ? '' : 'hidden'} `}>
                        Close Chat
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100 dark:bg-gray-900">

                {chatHistory?.map((item, index) => (
                    <div key={index}>
                        {(item?.to === selectedUser.socketId || item?.from === selectedUser.socketId) && (

                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow ${item?.from === socket.id ? "bg-blue-500 text-white ml-auto rounded-br-none" : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 mr-auto rounded-bl-none"}`}>
                                {/* Message Text */}
                                <div>{item?.message}</div>

                                {/* Time */}
                                <div className="text-[10px] opacity-70 mt-1 text-right">
                                    {new Date(item?.time).toLocaleTimeString()}
                                </div>
                            </div>

                        )}
                    </div>
                ))}

                <div ref={bottomScrollRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 border-t flex gap-2">
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-4 py-2"
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleSendMessage(event)}
                />
                <button className="btn btn-info" onClick={(event) => handleSendMessage(event)}>
                    Send
                </button>
            </div>
        </div>
    );
}
