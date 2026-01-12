import { RouterProvider } from "react-router-dom";
import router from "./Routes/router";
import { useEffect } from "react";
import socket from "./Context/socket";

export default function App() {

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        return () => {
            socket.off('connect')
        }
    }, [])
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
