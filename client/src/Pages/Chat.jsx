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


    console.log('chatHistory :>> ', chatHistory);

    return (
        <div className='h-full flex '>
            <SideBar
                setSelectedUser={setSelectedUser}
                unRead={unRead}
            />
            <ChatWindow
                selectedUser={selectedUser}
                chatHistory={chatHistory}
                setUnRead={setUnRead}
            />
        </div>
    )
}
