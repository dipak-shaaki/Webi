import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageEnd from './PageEnd'

const Info = ({ currentPage, onNavigate }) => {
  const containerRef = useRef(null)
  const bottomSectionRef = useRef(null)
  const [photosVisible, setPhotosVisible] = useState(false)
  const [photoSet, setPhotoSet] = useState(0)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasAutoTransitioned, setHasAutoTransitioned] = useState(false)
  const scrollDeltaRef = useRef(0)
  const decayTimeoutRef = useRef(null)

  const beyondPhotos = [
    { src: `${import.meta.env.BASE_URL}photo/pic1.jpg` },
    { src: `${import.meta.env.BASE_URL}photo/pic2.jpg` },
    { src: `${import.meta.env.BASE_URL}photo/pic3.jpg` },
    { src: `${import.meta.env.BASE_URL}photo/pic4.jpg` },
    { src: `${import.meta.env.BASE_URL}photo/pic6.jpg` }
  ]

  const InstagramPost = ({ photo }) => (
    <motion.button
      type="button"
      key={`${photo.src}-${photoSet}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onClick={() => setPhotoSet((photoSet + 1) % beyondPhotos.length)}
      className="w-full min-w-[85%] sm:min-w-0 aspect-[3/4] overflow-hidden rounded-lg bg-[#E0DDD6] shadow-lg cursor-pointer focus:outline-none snap-center"
    >
      <img src={photo.src} alt="A glimpse beyond the code" className="w-full h-full object-cover" />
    </motion.button>
  )

  const { scrollYProgress } = useScroll({ container: containerRef })
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

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
          setTimeout(() => { if (onNavigate) onNavigate('work') }, 150)
        } else {
          decayTimeoutRef.current = setTimeout(() => { scrollDeltaRef.current = 0; setTransitionProgress(0) }, 250)
        }
      } else if (e.deltaY < 0) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
        scrollDeltaRef.current = 0; setTransitionProgress(0)
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

  const NAV_BTN = 'text-2xl sm:text-3xl text-[#1A1814]/60 hover:text-[#1A1814] transition-colors duration-300 leading-none font-normal'

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none scroll-smooth">

      {/* HEADER (Synchronized across all components) */}
      <header className="sticky top-0 inset-x-0 h-[76px] sm:h-[104px] pt-4 sm:pt-8 pb-6 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-50 bg-transparent relative">
        <div className="flex gap-4 sm:gap-10 md:gap-24">
        <button onClick={() => onNavigate && onNavigate('info')} className="text-left focus:outline-none cursor-pointer">
          <h2 className={`text-lg sm:text-3xl whitespace-nowrap leading-none font-medium ${currentPage === 'info' ? 'text-[#0755AA] underline underline-offset-8 decoration-2' : 'text-[#1A1814]'}`}>About</h2>
        </button>
        <button onClick={() => onNavigate && onNavigate('work')} className="justify-self-center text-left focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Work</h2>
        </button>
        </div>
        <div className="fixed left-[46%] -translate-x-1/2 top-3 sm:left-1/2 sm:top-9 z-[60]">
          <button onClick={() => onNavigate && onNavigate('home')} className="text-[10px] whitespace-nowrap tracking-[0.12em] text-[#1A1814]/50 hover:text-[#1A1814] transition-colors uppercase focus:outline-none cursor-pointer">HOME</button>
        </div>
        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-10 md:gap-24">
        <button onClick={() => onNavigate && onNavigate('playground')} className="justify-self-center text-left focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Explore</h2>
        </button>
        <button onClick={() => onNavigate && onNavigate('contact')} className="justify-self-end text-left focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Contact</h2>
        </button>
        </div>
      </header>

      {/* MAIN: Bio */}
      <main className="w-full pt-4 pb-16">
        
        {/* Initials and introduction */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} 
          className="w-full px-8 sm:px-16 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-10">
          
          <h1 className="font-sans text-[88px] sm:text-[160px] md:text-[220px] font-medium tracking-tighter text-[#1A1814] leading-[0.8] cursor-default shrink-0">
            <span className="sr-only">Dipak Shanki</span>
            <span className="relative inline-block group">
              D
              <span className="absolute left-1/2 top-full mt-5 -translate-x-1/2 translate-y-2 text-sm sm:text-base font-medium tracking-normal text-[#1A1814]/60 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Dipak
              </span>
            </span>
            <span>.</span>
            <span className="relative inline-block group">
              S
              <span className="absolute left-1/2 top-full mt-5 -translate-x-1/2 translate-y-2 text-sm sm:text-base font-medium tracking-normal text-[#1A1814]/60 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Shanki
              </span>
            </span>
            <span>.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#1A1814]/80 font-medium leading-relaxed max-w-sm sm:max-w-xs md:max-w-sm sm:text-right">
I'm Dipak, an AI Engineer & Developer building intelligent agents, automated systems, and dynamic digital experiences.            </p>
        </motion.div>

      </main>

      {/* EDITORIAL STATEMENT */}
      <section className="w-full px-6 sm:px-16 md:px-24 py-24 border-t border-[#1A1814]/10 bg-[#E8E5DE]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-[#1A1814]">
            <span className="text-3xl sm:text-5xl md:text-6xl mr-4 inline-block opacity-20">✖✖✖</span>
            Kathmandu-based independent AI Engineer & Developer with focus on Machine Learning, Automation and Intelligent Web Production.
          </motion.div>

        </div>
      </section>

      {/* BEYOND THE CODE */}
      <section className="w-full px-6 sm:px-16 md:px-24 py-24 border-t border-[#1A1814]/10 bg-[#C6BEB5]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium uppercase leading-[0.95] tracking-tight text-[#1A1814]">
              Beyond<br />the code
            </h3>
            <div className="flex flex-col items-start md:items-end">
              <button
                type="button"
                onClick={() => setPhotosVisible((visible) => !visible)}
                className="text-sm sm:text-base uppercase tracking-[0.2em] text-[#0755AA] border-b border-[#0755AA] pb-1 hover:text-[#1A1814] hover:border-[#1A1814] transition-colors"
              >
                Click here
              </button>
            </div>

            {photosVisible && (
              <div className="md:col-span-2 mt-2 flex sm:grid sm:grid-cols-4 gap-4 w-full overflow-x-auto snap-x snap-mandatory scrollbar-hidden sm:overflow-visible">
                {beyondPhotos.slice(0, 4).map((_, index) => {
                  const photo = beyondPhotos[(index + photoSet) % beyondPhotos.length]
                  return <InstagramPost key={`${photo.src}-${photoSet}`} photo={photo} />
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <PageEnd nextPage="work" nextLabel="Work" onNavigate={onNavigate} progress={transitionProgress} />
    </div>
  )
}

export default Info
