import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Component/Navbar'

export default function Layout() {
    return (
        <div className="h-dvh flex flex-col bg-base-200 dark:bg-base-300">
            {/* NAVBAR */}
            {/* <Navbar /> */}
            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>

        </div>
    )
}
