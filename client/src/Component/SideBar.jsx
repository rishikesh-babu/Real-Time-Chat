import React, { useEffect, useState } from "react";
import socket from "../Context/socket";

export default function SideBar({ setSelectedUser }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.emit("users:get");
        socket.on("users:update", (data) => setUsers(data));

        return () => {
            socket.off("users:update");
        };
    }, []);

    return (
        <div className="w-72 h-full border-r border-gray-300 flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gray-900">
                <h2
                    className="text-xl font-bold text-gray-400"
                    onClick={() => setSelectedUser(null)}
                >
                    Toko Chat
                </h2>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                <button className="w-full btn btn-outline">
                    Group Chat 
                </button>
                {users.map((item) => (
                    <div key={item.socketId}>
                        {item.socketId !== socket.id && (
                            <div
                                onClick={() => setSelectedUser(item)}
                                className="py-3 px-4 border-b rounded flex items-center gap-3 cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 font-semibold text-gray-800 rounded-full bg-green-500 flex items-center justify-center">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Name */}
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm">Online</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
