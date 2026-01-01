import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Contact, Mail } from 'lucide-react'
import { motion } from 'motion/react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const RegisterForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Register:', { email, password })
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
                <h2 className="text-2xl text-white mb-2">Create Account</h2>
                <p className="text-zinc-500 text-sm">Start your learning journey today.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

                <Input
                    id="name"
                    label="Name"
                    type="text"
                    placeholder="Done Jogh"
                    value={name}
                    onChange={setName}
                    icon={Contact}
                />

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
                />

                <Button type="submit" variant="primary" className="mt-6">
                    Create Account →
                </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-zinc-500 text-sm mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:text-zinc-100 transition-colors">
                    Sign In
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

export default RegisterForm
