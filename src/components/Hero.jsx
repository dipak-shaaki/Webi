import { motion } from 'framer-motion'
import { useState } from 'react'

const Hero = ({ onWorkClick, onAboutClick }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e
        const moveX = (clientX - window.innerWidth / 2) / 30
        const moveY = (clientY - window.innerHeight / 2) / 30
        setMousePosition({ x: moveX, y: moveY })
    }

    return (
        <div
            className="relative flex flex-col items-center justify-center text-center min-h-[85vh] px-4 overflow-visible"
            onMouseMove={handleMouseMove}
        >

            {/* Name Section - Static */}
            <div className="space-y-4 relative z-10">
                <h1 className="font-grand text-[3.5rem] md:text-[6rem] lg:text-[6rem] text-gray-900 dark:text-[#ECE7C1] leading-[1.0] tracking-normal font-normal">
                    hi, I'm Dipak
                </h1>
                <h2 className="font-grand text-[1.5rem] md:text-[1.5rem] lg:text-[1.5rem] text-gray-700 dark:text-gray-300 leading-tight font-normal">
                    A Developer
                </h2>
            </div>



        </div>
    )
}

export default Hero
