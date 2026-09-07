import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SocialFooter from './SocialFooter'

const Contact = ({ currentPage, onNavigate }) => {
  const [hoverEmail, setHoverEmail] = useState(false)
  
  const kineticWords = ["experiences.", "products.", "solutions.", "interfaces.", "platforms.", "agents.", "websites."]
  const [kineticIndex, setKineticIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setKineticIndex(prev => (prev + 1) % kineticWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none scroll-smooth relative flex flex-col">

      {/* STICKY HEADER (Standardized for zero shift) */}
      <header className="sticky top-0 inset-x-0 h-[76px] sm:h-[104px] pt-4 sm:pt-8 pb-6 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-50 bg-transparent relative">
        <div className="flex gap-4 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate && onNavigate('info')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className="text-lg sm:text-3xl whitespace-nowrap font-medium text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none">About</h2>
          </button>
          <button onClick={() => onNavigate && onNavigate('work')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className="text-lg sm:text-3xl whitespace-nowrap font-medium text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none">Work</h2>
          </button>
        </div>

        {/* Centered home button */}
        <div className="fixed left-[46%] -translate-x-1/2 top-3 sm:left-1/2 sm:top-9 z-[60]">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-[10px] whitespace-nowrap tracking-[0.12em] text-[#1A1814]/50 hover:text-[#1A1814] transition-colors uppercase focus:outline-none cursor-pointer"
          >
                HOME
          </button>
        </div>

        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate && onNavigate('playground')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className="text-lg sm:text-3xl whitespace-nowrap font-medium text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none">Explore</h2>
          </button>
          <button onClick={() => onNavigate && onNavigate('contact')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className={`text-lg sm:text-3xl whitespace-nowrap font-medium leading-none ${currentPage === 'contact' ? 'text-[#0755AA] underline underline-offset-8 decoration-2' : 'text-[#1A1814]'}`}>Contact</h2>
          </button>
        </div>
      </header>

      {/* MAIN TYPOGRAPHIC HERO — RESPONSIVE */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 pt-4 pb-12 max-w-[1400px] mx-auto w-full">

        {/* Line 1: Let's make *something* great! */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-x-2 sm:gap-x-4 leading-none mb-4 sm:mb-6 whitespace-nowrap"
        >
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[90px] font-normal text-[#1A1814] leading-none tracking-tight">
            Let's Build
          </span>
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[90px] font-normal text-[#1A1814] leading-none tracking-tight">
            Something That Matters!
          </span>

        </motion.div>

        {/* Line 2: [Reach out oval] + email */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-4 mb-4 sm:mb-6"
        >
          {/* Oval Reach out button */}
          <a
            href="mailto:shanki.dipak@gmail.com"
            className="inline-flex items-center justify-center px-6 sm:px-10 py-3 sm:py-5 rounded-full border-2 border-[#1A1814] text-[#1A1814] text-lg sm:text-2xl md:text-3xl font-normal hover:bg-[#1A1814] hover:text-[#F0EDE6] transition-all duration-300 shrink-0"
          >
            Reach out
          </a>

          {/* Email */}
          <a
            href="mailto:shanki.dipak@gmail.com"
            onMouseEnter={() => setHoverEmail(true)}
            onMouseLeave={() => setHoverEmail(false)}
            className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[90px] font-normal text-[#0755AA] leading-none tracking-tight underline underline-offset-4 sm:underline-offset-8 decoration-[#0755AA]/40 hover:decoration-[#0755AA] transition-all duration-300 break-all sm:break-normal"
          >
            shanki.dipak@gmail.com
          </a>
        </motion.div>

        {/* Line 3: for —wonderful— experiences. ✶ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-3 sm:gap-x-6 gap-y-2"
        >
          <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[120px] font-normal text-[#1A1814] leading-none tracking-tight">
            for
          </span>

          {/* Inline "wonderful" text with lines */}
          <span className="inline-flex items-center gap-2 sm:gap-3 self-center">
            <span className="block w-8 sm:w-16 md:w-24 h-[1px] sm:h-[2px] bg-[#1A1814]/40" />
            <span className="text-sm sm:text-xl md:text-2xl font-normal italic text-[#1A1814]/60 tracking-wide">wonderful</span>
            <span className="block w-8 sm:w-16 md:w-24 h-[1px] sm:h-[2px] bg-[#1A1814]/40" />
          </span>

          <div className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[120px] font-normal text-[#1A1814] leading-none tracking-tight h-[1em] overflow-hidden flex items-end">
            <AnimatePresence mode="wait">
              <motion.span 
                key={kineticWords[kineticIndex]}
                initial={{ opacity: 0, y: 15, rotateX: -45 }} 
                animate={{ opacity: 1, y: 0, rotateX: 0 }} 
                exit={{ opacity: 0, y: -15, rotateX: 45 }}
                transition={{ duration: 0.45, ease: 'easeOut' }} 
                className="block text-[#0755AA]"
              >
                {kineticWords[kineticIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

      </main>

      <SocialFooter />

    </div>
  )
}

export default Contact
