import React from 'react'
import Theme from './Theme'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserData } from '../Redux/Features/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLogin } = useSelector(state => state.user)

    function handleLogout() {
        dispatch(clearUserData())
    }

    return (
        <nav className="p-7 text-primary bg-white/30 dark:bg-gray-900/40 shadow-md border-b border-white/20 dark:border-gray-700/40 flex justify-between items-center ">
            <div className="text-2xl font-bold " onClick={() => navigate('/')}>Chat App</div>

            <div className="flex gap-5">
                {/* <Theme /> */}

                {isLogin && (
                    <div className="btn btn-error" onClick={handleLogout}>
                        Logout
                    </div>
                )}
            </div>
        </nav>
    );
}
