import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { isLogin, name } = useSelector(state => state.user)
    const navigate = useNavigate();

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                goToChat()
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => window.removeEventListener('keydown', handleKeyPress)        
    }, [isLogin])

    function goToChat() {
        if (!isLogin) {
            navigate("/login");
        } else {
            navigate("/chat");
        }
    };

    return (
        <div className=" h-full bg-gray-900 text-white flex items-center justify-center px-6">

            <div className="text-center max-w-lg">

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to <span className="text-purple-400">Your Chat App</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-300 text-lg mb-8">
                    Chat in realtime with anyone online.
                    Choose between <span className="text-purple-300">Group Chat</span>,
                    <span className="text-purple-300"> Private Chat</span>, or
                    <span className="text-purple-300"> Random Match</span>.
                </p>

                {/* Button */}
                <button
                    onClick={goToChat}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-medium transition-all"
                >
                    {name ? "Enter Chat" : "Login to Start"}
                </button>

                {/* Extra note */}
                <p className="mt-4 text-gray-400 text-sm">
                    {name ? (
                        <>Logged in as <b>{name}</b></>
                    ) : (
                        <>You will be redirected to login</>
                    )}
                </p>

            </div>
        </div>
    );
}
