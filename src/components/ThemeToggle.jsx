import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'

const ThemeToggle = ({ className = "" }) => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
        if (!isDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    return (
        <motion.button
            onClick={toggleTheme}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg ${className}`}
            aria-label="Toggle theme"
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5 }}
            >
                {isDark ? (
                    <FiMoon className="text-yellow-300" size={20} />
                ) : (
                    <FiSun className="text-yellow-600" size={20} />
                )}
            </motion.div>
        </motion.button>
    )
}

export default ThemeToggle
