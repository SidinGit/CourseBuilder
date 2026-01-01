import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { motion } from 'motion/react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { authAPI } from '../../services/api'
import { setCredentials } from '../../store/authSlice'
import { useAppDispatch } from '../../store/hooks'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { access_token, user } = await authAPI.login(email, password)
            localStorage.setItem('token', access_token)
            dispatch(setCredentials({ user, token: access_token }))
            navigate("/dashboard")
        } catch (error) {
            console.error('Login failed: ', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-[#121212] border border-zinc-800 rounded-2xl p-8"
        >
            {/* Form Header */}
            <div className="mb-8">
                <h2 className="text-2xl text-white mb-2">Welcome Back</h2>
                <p className="text-zinc-500 text-sm">Enter your credentials to access your courses.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                    required
                />

                <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    required
                    rightLabel={
                        <a href="#" className="text-zinc-500 hover:text-zinc-400 transition-colors text-sm">
                            Forgot Password?
                        </a>
                    }
                />

                <Button type="submit" variant="primary" className="mt-6">
                    Log In →
                </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-zinc-500 text-sm mt-8">
                Don't have an account?{' '}
                <Link to="/register" className="text-white hover:text-zinc-100 transition-colors">
                    Sign Up
                </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-zinc-600 text-xs mt-4">
                By continuing, you agree to our{' '}
                <a href="#" className="text-zinc-500 hover:text-zinc-400">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-zinc-500 hover:text-zinc-400">Privacy Policy</a>.
            </p>
        </motion.div>
    )
}

export default LoginForm
