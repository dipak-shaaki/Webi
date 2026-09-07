import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SocialFooter from './SocialFooter'

const Home = ({ onNavigate }) => {
  const containerRef = useRef(null)
  const bottomSectionRef = useRef(null)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasAutoTransitioned, setHasAutoTransitioned] = useState(false)
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false)
  const scrollDeltaRef = useRef(0)
  const decayTimeoutRef = useRef(null)

  const { scrollYProgress } = useScroll({ container: containerRef })
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  const handleScroll = (e) => {
    // 100vh minus roughly the header's height
    const threshold = window.innerHeight - 100
    if (e.target.scrollTop > threshold) {
      if (!isScrolledPastHero) setIsScrolledPastHero(true)
    } else {
      if (isScrolledPastHero) setIsScrolledPastHero(false)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let lastTouchY = null

    const handleWheel = (e) => {
      if (hasAutoTransitioned) return
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 15
      if (isAtBottom && e.deltaY > 0) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
        scrollDeltaRef.current += e.deltaY
        const pct = Math.min(Math.max((scrollDeltaRef.current / 1200) * 100, 0), 100)
        setTransitionProgress(pct)
        if (pct >= 100 && !hasAutoTransitioned) {
          setHasAutoTransitioned(true)
          setTimeout(() => { if (onNavigate) onNavigate('info') }, 150)
        } else {
          decayTimeoutRef.current = setTimeout(() => {
            scrollDeltaRef.current = 0
            setTransitionProgress(0)
          }, 250)
        }
      } else if (e.deltaY < 0) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
        scrollDeltaRef.current = 0
        setTransitionProgress(0)
      }
    }

    const handleTouchStart = (event) => { lastTouchY = event.touches[0]?.clientY ?? null }
    const handleTouchMove = (event) => {
      const touchY = event.touches[0]?.clientY
      if (lastTouchY === null || touchY === undefined) return
      handleWheel({ deltaY: (lastTouchY - touchY) * 4 })
      lastTouchY = touchY
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
    }
  }, [hasAutoTransitioned, onNavigate])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none scroll-smooth relative"
    >
      {/* STICKY HEADER - h-0 so it doesn't push the hero down, but contents overflow and stay sticky */}
      <header className="sticky top-0 inset-x-0 z-50 h-0 overflow-visible">
        <div className="pt-4 sm:pt-8 pb-6 px-4 sm:px-16 flex justify-between items-start w-full pointer-events-none">
          {/* Left Nav */}
          <div className="flex gap-4 sm:gap-10 md:gap-24 pointer-events-auto">
            <button onClick={() => onNavigate && onNavigate('info')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className={`text-lg sm:text-3xl font-medium transition-colors leading-none drop-shadow-md ${isScrolledPastHero ? 'text-[#1A1814] hover:text-[#0755AA]' : 'text-white hover:text-[#1A1814]'}`}>About</h2>
            </button>
            <button onClick={() => onNavigate && onNavigate('work')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className={`text-lg sm:text-3xl font-medium transition-colors leading-none drop-shadow-md ${isScrolledPastHero ? 'text-[#1A1814] hover:text-[#0755AA]' : 'text-white hover:text-[#1A1814]'}`}>Work</h2>
            </button>
          </div>

          {/* Right Nav */}
          <div className="flex gap-3 sm:gap-10 md:gap-24 pointer-events-auto">
            <button onClick={() => onNavigate && onNavigate('playground')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className={`text-lg sm:text-3xl font-medium transition-colors leading-none drop-shadow-md ${isScrolledPastHero ? 'text-[#1A1814] hover:text-[#0755AA]' : 'text-white hover:text-[#1A1814]'}`}>Explore</h2>
            </button>
            <button onClick={() => onNavigate && onNavigate('contact')} className="group text-left focus:outline-none cursor-pointer">
              <h2 className={`text-lg sm:text-3xl font-medium transition-colors leading-none drop-shadow-md ${isScrolledPastHero ? 'text-[#1A1814] hover:text-[#0755AA]' : 'text-white hover:text-[#1A1814]'}`}>Contact</h2>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <div
        className="relative w-full h-screen flex flex-col"
        style={{
          backgroundImage: "url('/usethis.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      >
        {/* HERO CONTENT - vertically centered, sides */}
        <section className="relative w-full flex-1 flex items-center px-8 sm:px-16 overflow-hidden select-none z-10">

          <div className="relative w-full -translate-y-10 sm:translate-y-0 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">

            {/* Left: Location Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2 text-center md:text-left max-w-xs"
            >
                  <span className="font-mono text-[10px] sm:text-xs text-white/80 tracking-widest uppercase block font-medium drop-shadow-md">
                    BASED IN
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold leading-tight drop-shadow-md">
                Kathmandu, Nepal
              </h3>
            </motion.div>

            {/* Right: Role */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-col gap-4 text-center md:text-right max-w-sm w-full"
            >
              <div className="flex flex-col gap-2">
                   <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold leading-tight drop-shadow-md">
                     AI/ML Engineer &
                </h3>
                <p className="text-lg sm:text-xl md:text-3xl text-white/90 font-normal leading-snug drop-shadow-md">
                     Developer
                </p>
              </div>
              
            </motion.div>

          </div>

        </section>
      </div>

      {/* EDITORIAL STATEMENT (Clean, generous top & bottom padding) */}
      <section className="w-full px-8 sm:px-16 py-14 sm:py-20 border-t border-[#1A1814]/10 bg-transparent">
        <div className="w-full text-left">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.2] text-[#1A1814] w-full">
            I build things that think — from autonomous AI agents to full-stack platforms built for scale and{' '}
            <span className="text-[#0755AA]">elegance</span>.
          </motion.p>
        </div>
      </section>

      {/* MY MAIN SERVICES (Clean spacious top padding) */}
      <section className="w-full px-8 sm:px-16 pt-20 sm:pt-28 pb-16 bg-[#C6BEB5]">
        {/* Section Tag Header */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-[#1A1814]/60 uppercase border-b border-[#1A1814]/20 pb-1 font-medium">
            WHAT I DO
          </span>
        </div>

        {/* Editorial Services Grid Layout */}
        <div className="space-y-10 sm:space-y-16 w-full">

          {/* Row 1: Art direction  Product design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
          >
          
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1814] tracking-tight leading-none text-center mx-auto whitespace-nowrap">
             Product Design
            </span>
          </motion.div>

          {/* Row 2: Visual design (Underlined in Orange)  Mobile & web design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
          >
            {/* Underlined orange highlight */}
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal italic text-[#1A1814] tracking-tight leading-none border-b-2 sm:border-b-4 border-[#0755AA] pb-1 sm:pb-2 whitespace-nowrap">
              AI Agents Dev.
            </span>

            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1814] tracking-tight leading-none text-center md:text-right whitespace-nowrap">
             Web Development
            </span>
          </motion.div>

          {/* Row 3: Interaction design  —— & ——  Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
          >
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1814] tracking-tight leading-none whitespace-nowrap">
              Automation
            </span>

            {/* Rule with Ampersand */}
            <div className="flex items-center gap-3 my-1 md:my-0 shrink-0">
              <span className="w-8 sm:w-16 md:w-20 h-[1px] sm:h-[2px] bg-[#1A1814]/40" />
              <span className="font-mono text-sm sm:text-base font-light text-[#1A1814]/70">&</span>
              <span className="w-8 sm:w-16 md:w-20 h-[1px] sm:h-[2px] bg-[#1A1814]/40" />
            </div>

            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1814] tracking-tight leading-none whitespace-nowrap">
              Scraping
            </span>
          </motion.div>

        </div>
      </section>

      {/* INFINITE HORIZONTAL MARQUEE TICKER BANNER ("Let's create something together EMAIL ME") */}
      <section className="w-full py-10 border-t border-[#1A1814]/15 bg-[#C6BEB5] overflow-hidden select-none mt-12 mb-0">
        <div className="flex w-full overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-10 sm:gap-16 whitespace-nowrap shrink-0"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 sm:gap-16 shrink-0">
                <span className="text-3xl sm:text-5xl md:text-6xl font-light text-[#1A1814] tracking-tight leading-none">
                  Let's create something together
                </span>
                <button
                  onClick={() => onNavigate && onNavigate('contact')}
                  className="px-6 py-2.5 bg-[#1A1814] text-[#C6BEB5] text-xs sm:text-base font-mono font-medium tracking-widest uppercase hover:bg-[#0755AA] transition-colors rounded-sm shadow-md cursor-pointer"
                >
                  EMAIL ME
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OVERSCROLL → INFO (Clean single border line, prominent title, spacious footer) */}
      <section ref={bottomSectionRef} className="w-full px-8 sm:px-16 pt-12 pb-16 bg-[#C6BEB5] border-t border-[#1A1814]/15 select-none">
        <div className="w-full flex flex-col gap-10 sm:gap-12">

          {/* Top Bar: Progress indicator & next page button */}
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-xs text-[#1A1814]/50 tracking-widest uppercase">
            <div className="leading-tight">
              <span>KEEP SCROLLING</span><br />
              <span>TO NEXT PAGE</span>
            </div>
            <button onClick={() => onNavigate && onNavigate('info')} className="flex items-center gap-3 group cursor-pointer focus:outline-none">
              <span>NEXT PAGE</span>
              <div className="w-20 sm:w-28 h-[2px] bg-[#1A1814]/15 rounded-full overflow-hidden">
                <div className="h-full bg-[#0755AA] transition-all duration-300 ease-out" style={{ width: `${transitionProgress}%` }} />
              </div>
              <span className="text-[#1A1814] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Main Next Page Title (Prominent Bold Hero Size) */}
          <h2
            onClick={() => onNavigate && onNavigate('info')}
            className="text-5xl sm:text-7xl md:text-8xl text-[#1A1814] font-bold uppercase tracking-tight hover:text-[#0755AA] transition-colors cursor-pointer leading-none my-2"
          >
            ABOUT
          </h2>

          {/* Generous Footer Divider & Social Links */}
          <SocialFooter />

        </div>
      </section>
    </div>
  )
}

export default Home
