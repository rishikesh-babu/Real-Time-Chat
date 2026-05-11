import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Component/SideBar';
import ChatWindow from '../Component/ChatWindow';
import socket from '../Context/socket';

export default function Chat() {
    const [selectedUser, setSelectedUser] = useState(null)
    const [chatHistory, setChatHistory] = useState([])
    const { isLogin, name } = useSelector(state => state.user);
    const [unRead, setUnRead] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLogin) {
            navigate('/login')
        }
    }, [isLogin])

    useEffect(() => {
        if (!name) return

        socket.emit('user:join', name)

        return () => {
            socket.emit('user:leave')
        }
    }, [])

    useEffect(() => {
        socket.on('private:message', (data) => {
            setChatHistory((prev) => ([
                ...prev,
                data
            ]))

            setUnRead((prev) => {
                const from = data.from
                return {
                    ...prev,
                    [from]: {
                        count: (prev[from]?.count || 0) + 1,
                        time: data.time
                    }
                }
            })
        })

        return () => {
            socket.off('private message')
        }
    }, [])

    return (
        <div className="h-full flex items-center justify-center bg-[#0f1115] overflow-hidden">
            {/* Main Chat Container */}
            <div className="relative w-full h-full max-w-[1600px] flex overflow-hidden glassmorphism-dark animate-fade-in shadow-2xl">
                {/* Sidebar - hidden on mobile when a user is selected */}
                <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 h-full border-r border-white/10`}>
                    <SideBar
                        setSelectedUser={setSelectedUser}
                        unRead={unRead}
                    />
                </div>

                {/* Chat Window - hidden on mobile when no user is selected */}
                <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 h-full`}>
                    <ChatWindow
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        chatHistory={chatHistory}
                        setUnRead={setUnRead}
                    />
                </div>
            </div>
        </div>
    )
}
