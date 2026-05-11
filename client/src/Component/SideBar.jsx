import React, { useEffect, useState } from "react";
import socket from "../Context/socket";
import { MoreVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUserData } from "../Redux/Features/userSlice";

export default function SideBar({ setSelectedUser, unRead }) {
    const [users, setUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        socket.emit("users:get");
        socket.on("users:update", (data) => setUsers(data));

        return () => {
            socket.off("users:update");
        };
    }, []);

    function formatChatTime(time) {
        const date = new Date(time);

        const today = new Date();
        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        // today
        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // yesterday
        if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        // older dates
        return date.toLocaleDateString();
    };

    function toggleMenu() {
        setMenuOpen(!menuOpen)
    }

    function handleLogOut() { 
        dispatch(clearUserData())
    }

    return (
        <div className="w-72 h-full border-r border-gray-300 flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gray-900 flex justify-between items-center">
                <div
                    className="text-xl font-bold text-gray-400"
                    onClick={() => setSelectedUser(null)}
                >
                    TokoChat
                </div>

                <div className="relative flex justify-center items-center select-none">
                    <button onClick={toggleMenu} className=" cursor-pointer">
                        <MoreVertical />
                    </button>
                    <button onClick={handleLogOut} className={`absolute right-0 top-10 p-2 text-nowrap text-white bg-gray-700 border rounded-md ${menuOpen ? 'block' : 'hidden'} `}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {users.map((item) => (
                    <div key={item.socketId}>
                        {item.socketId !== socket.id && (
                            <div
                                onClick={() => setSelectedUser(item)}
                                className="py-3 px-4 hover:bg-gray-700 rounded-xl duration-300 flex items-center gap-3 cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 font-semibold text-gray-800 rounded-full bg-green-500 flex items-center justify-center">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Name */}
                                <div className="font-medium">
                                    {item?.name}
                                </div>

                                {/* UnRead */}
                                {unRead[item.socketId]?.count > 0 &&
                                    <div className="ml-auto mr-4 flex flex-col justify-center items-center ">
                                        <div className=" font-bold text-sm text-green-600">
                                            {formatChatTime(unRead[item.socketId].time)}
                                        </div>
                                        <span className="px-2 font-bold text-black bg-green-500 border rounded-full">
                                            {unRead[item.socketId].count}
                                        </span>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
