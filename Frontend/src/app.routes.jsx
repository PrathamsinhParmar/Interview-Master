import { createBrowserRouter, Navigate } from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Protected from './features/auth/components/Protected.jsx'
import Home from './features/interview/pages/Home.jsx'
import Interview from './features/interview/pages/Interview.jsx'
import Testimonials from './features/interview/pages/Testimonials.jsx'
import Contact from './features/interview/pages/Contact.jsx'
import About from './features/interview/pages/About.jsx'
import MockInterview from './features/interview/pages/MockInterview.jsx'
import Landing from './features/interview/pages/Landing.jsx'

export const router = createBrowserRouter([
    {
        // Public landing page — default entry point
        path: "/landing",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/mock-interview",
        element: <Protected><MockInterview /></Protected>
    },
    {
        path: "/testimonials",
        element: <Testimonials />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/about",
        element: <About />
    }
])