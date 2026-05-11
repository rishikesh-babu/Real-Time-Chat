import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveUserData } from '../Redux/Features/userSlice'

export default function Login() {
    const [name, setName] = useState('')
    const { isLogin } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const inputRef = useRef()

    useEffect(() => {
        inputRef.current?.focus()
        
        if (isLogin) {
            navigate('/chat')
        }
    }, [isLogin])

    function handleLogin() {
        if (!name.trim()) return
        dispatch(saveUserData(name.trim()))
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-base-200">
            {/* Title */}
            <h1 className="mb-8 font-bold text-4xl text-primary">
                Login
            </h1>

            {/* Card */}
            <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
                <div className="card-body gap-4">

                    <label className="form-control w-full">
                        <div className="label">
                            <span className=" text-lg font-medium">Chat Name</span>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Enter chat name"
                            className="w-full input input-bordered"
                            onChange={(event) => setName(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
                        />
                    </label>

                    <button className="mt-4 btn sm:iinbtn-outline btn-primary w-full" onClick={handleLogin}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
