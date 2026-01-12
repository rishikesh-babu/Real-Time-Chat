import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Layout from "./Layout";
import Chat from "../Pages/Chat";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: 'err',
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'login',
                element: <Login />
            }, 
            {
                path: 'chat', 
                element: <Chat />
            }
        ]
    }
])

export default router