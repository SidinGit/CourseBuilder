import { motion } from 'motion/react'
import { Outlet } from 'react-router-dom'
import logo from '/logo.png'


const AuthLayout = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-8">
            {/* Subtle Background Logo */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <img src={logo} alt="" className="w-[1000px] h-auto scale-[180%]" />
            </div>

            <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Side - Promotional Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl text-white mb-6 leading-tight">
                        Turn <span className="text-[#FF0000]">YouTube</span> into<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-200">
                            Personalized<br />Courses
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md">
                        Master any skill by transforming unstructured video content into structured learning paths with AI.
                    </p>
                </motion.div>

                {/* Right Side - Form Content */}
                <div className="w-full max-w-md mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
