import { useState } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface InputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  required?: boolean
  rightLabel?: React.ReactNode  // For "Forgot Password?" link
}

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  rightLabel,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-zinc-400 text-sm">
          {label}
        </label>
        {rightLabel}
      </div>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:bg-zinc-900 focus:border-zinc-700 transition-all"
          placeholder={placeholder}
          required={required}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : Icon ? (
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        ) : null}
      </div>
    </div>
  )
}

export default Input
