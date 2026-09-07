import React from 'react'
import { motion } from 'framer-motion'

const Hero = ({ onNavigate }) => {
  const navItems = [
    { id: 'info', title: 'About' },
    { id: 'work', title: 'Work' },
    { id: 'playground', title: 'Explore' },
    { id: 'contact', title: 'Contact' }
  ]

  return (
    <div 
      className="relative w-screen h-screen text-[#E3DEC3] font-sans overflow-hidden select-none" 
      style={{ 
        backgroundImage: "url('/usethis.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Subtle Overlay to ensure text readability against the image */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="absolute top-0 inset-x-0 pt-4 sm:pt-8 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-30">
        {/* Left items: Info & Work */}
        <div className="flex gap-4 sm:gap-16 md:gap-24">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className="group text-left focus:outline-none cursor-pointer"
            >
              <h2 className="font-fraunces text-lg sm:text-3xl text-white/90 group-hover:text-white transition-colors leading-none font-normal">
                {item.title}
              </h2>

            </button>
          ))}
        </div>

        {/* Right items: Explore & Contact */}
        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-16 md:gap-24">
          {navItems.slice(2, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className="group text-left focus:outline-none cursor-pointer"
            >
              <h2 className="font-fraunces text-lg sm:text-3xl text-white/90 group-hover:text-white transition-colors leading-none font-normal">
                {item.title}
              </h2>
              <span className="text-[9px] font-mono tracking-widest text-white/60 group-hover:text-white/80 transition-colors uppercase block mt-2">
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA - LOCATION & TITLES */}
      <main className="relative z-10 w-full h-full flex items-center justify-between px-8 sm:px-24">
        
        {/* Left: Location Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-2 text-left max-w-xs"
        >
          <span className="font-mono text-[10px] sm:text-xs text-white/60 tracking-widest uppercase block font-medium">
            BASED IN
          </span>
          <h3 className="text-2xl sm:text-4xl text-white font-semibold leading-tight">
            Kathmandu, Nepal
          </h3>
        </motion.div>

        {/* Right: Titles / Roles */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col gap-2 text-right max-w-xs"
        >
          <h3 className="text-3xl sm:text-5xl text-white font-semibold leading-tight">
            AI/ML Engineer
          </h3>
          <p className="text-xl sm:text-3xl text-white/80 font-normal leading-snug">
            Developer
          </p>
        </motion.div>

      </main>

      {/* BOTTOM FOOTER / SOCIAL BAR */}
      <footer className="absolute bottom-0 inset-x-0 pb-8 px-8 sm:px-16 flex justify-center items-end text-xs font-mono z-30">
        <div className="flex items-center gap-12 font-fraunces text-sm text-white/70 italic">
          <a href="https://github.com/dipak-shaaki" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Github</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </footer>

    </div>
  )
}

export default Hero
