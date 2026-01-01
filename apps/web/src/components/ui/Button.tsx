import { motion } from 'motion/react'

interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit'
  variant?: 'primary' | 'outline'
  onClick?: () => void
  className?: string
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  className = '',
}: ButtonProps) => {
  const baseStyles = 'w-full py-3 rounded-lg transition-all'
  
  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-100',
    outline: 'bg-transparent border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default Button