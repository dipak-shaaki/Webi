import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import PageEnd from './PageEnd'

const Work = ({ currentPage, onNavigate }) => {
  const containerRef = useRef(null)
  const bottomSectionRef = useRef(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasAutoTransitioned, setHasAutoTransitioned] = useState(false)
  const scrollDeltaRef = useRef(0)
  const decayTimeoutRef = useRef(null)

  const { scrollYProgress } = useScroll({ container: containerRef })
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // Track mouse position for floating preview
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/dipak-shaaki/repos?sort=updated&per_page=12')
        if (response.ok) {
          const data = await response.json()
          const imagePool = [
            `${import.meta.env.BASE_URL}info.jpg`,
            `${import.meta.env.BASE_URL}about.jpg`
          ]
          const categoryPool = [
            'Interaction & Development',
            'AI / ML Engineering',
            'Design & Development',
            'Data Science',
            'Automation & Backend',
            'Research & Tooling'
          ]
          const editorialTitles = [
            'Bhetiyo AI',
            'RAG Agent',
            'Wildfire Watch',
            'Nagarik',
            'Fare Adjuster',
            'Audit Agent'
          ]
          const formattedProjects = data.slice(0, 6).map((repo, idx) => ({
            id: (idx + 1).toString().padStart(2, '0'),
            title: editorialTitles[idx] || repo.name,
            fullRepoName: repo.name,
            url: repo.html_url,
            category: categoryPool[idx] || repo.language || 'Development',
            image: imagePool[idx % imagePool.length]
          }))
          setProjects(formattedProjects)
        } else throw new Error()
      } catch {
        setProjects([
          { id: '01', title: 'Bhetiyo AI', fullRepoName: 'Bhetiyo', url: 'https://github.com/dipak-shaaki/Bhetiyo', category: 'Interaction & Development', image: `${import.meta.env.BASE_URL}imageee.jpg` },
          { id: '02', title: 'RAG Agent', fullRepoName: 'RAG_AGENT', url: 'https://github.com/dipak-shaaki/RAG_AGENT', category: 'AI / ML Engineering', image: `${import.meta.env.BASE_URL}imageee.jpg` },
          { id: '03', title: 'Wildfire Watch', fullRepoName: 'Nepal-Wildfire-Watch', url: 'https://github.com/dipak-shaaki/Nepal-Wildfire-Watch', category: 'Design & Development', image: `${import.meta.env.BASE_URL}imageee.jpg` },
          { id: '04', title: 'Nagarik', fullRepoName: 'Nagarik-Sahayog', url: 'https://github.com/dipak-shaaki/Nagarik-Sahayog', category: 'Design & Development', image: `${import.meta.env.BASE_URL}imageee.jpg` },
          { id: '05', title: 'Fare Adjuster', fullRepoName: 'Real-Time-Fare-Adjuster', url: 'https://github.com/dipak-shaaki/Real-Time-Fare-Adjuster', category: 'Automation & Backend', image: `${import.meta.env.BASE_URL}imageee.jpg` },
          { id: '06', title: 'Audit Agent', fullRepoName: 'github-code-audit-agent', url: 'https://github.com/dipak-shaaki/github-code-audit-agent', category: 'Research & Tooling', image: `${import.meta.env.BASE_URL}imageee.jpg` }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchGitHubProjects()
  }, [])

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
        const pct = Math.min((scrollDeltaRef.current / 1200) * 100, 100)
        setTransitionProgress(pct)
        if (pct >= 100) {
          setHasAutoTransitioned(true)
          setTimeout(() => onNavigate && onNavigate('playground'), 150)
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
      onMouseMove={handleMouseMove}
      className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none scroll-smooth relative"
    >

      {/* STICKY HEADER (Transparent Background) */}
      <header className="sticky top-0 inset-x-0 h-[76px] sm:h-[104px] pt-4 sm:pt-8 pb-6 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-50 bg-transparent relative">
        <div className="flex gap-4 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate && onNavigate('info')} className="group text-left focus:outline-none cursor-pointer">
            <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">About</h2>
          </button>
          <button onClick={() => onNavigate && onNavigate('work')} className="text-left group cursor-pointer focus:outline-none">
            <h2 className={`text-lg sm:text-3xl whitespace-nowrap leading-none font-medium ${currentPage === 'work' ? 'text-[#0755AA] underline underline-offset-8 decoration-2' : 'text-[#1A1814]'}`}>Work</h2>
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

        {/* Right Nav */}
        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate && onNavigate('playground')} className="text-left group cursor-pointer focus:outline-none">
            <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Explore</h2>
          </button>
          <button onClick={() => onNavigate && onNavigate('contact')} className="text-left group cursor-pointer focus:outline-none">
            <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Contact</h2>
          </button>
        </div>
      </header>

      {/* MOUSE-FOLLOWING FLOATING PREVIEW WITH BLUE VIEW BADGE */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: mousePos.x - 170,
              top: mousePos.y - 150,
              pointerEvents: 'none',
              zIndex: 60
            }}
            className="w-72 sm:w-80 h-64 sm:h-72 rounded-xl overflow-hidden shadow-2xl border border-[#1A1814]/10 bg-[#E0DDD6]"
          >
            <img
              src={hoveredProject.image}
              alt={hoveredProject.title}
              className="w-full h-full object-cover brightness-90"
            />
            {/* Blue View Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#1C3ED3] flex items-center justify-center text-white text-xs font-medium shadow-xl">
                View
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORK HEADER */}
      <main className="w-full min-h-[150px] px-8 sm:px-16 py-8 flex items-center justify-center relative z-20">
        <h1 className="text-center text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-none text-[#1A1814] uppercase">
          Selected Works
        </h1>
      </main>

      {/* PROJECT LIST — Dennis Snellenberg style */}
      <section className="w-full px-8 sm:px-16 pt-6 pb-16 relative z-20">
        {loading ? (
          <div className="py-32 text-center font-mono text-xs tracking-widest text-[#1A1814]/50">LOADING...</div>
        ) : (
          <div className="divide-y divide-[#1A1814]/10">
            {projects.map((proj) => (
              <motion.a
                key={proj.id}
                href={proj.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex justify-between items-center py-10 sm:py-14 px-0 group cursor-pointer"
              >
                {/* Left: Project Title (Lighter Weight) */}
                <h2
                  className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none transition-all duration-300 ${
                    hoveredProject && hoveredProject.id !== proj.id
                      ? 'opacity-20 text-[#1A1814]'
                      : 'opacity-100 text-[#1A1814] group-hover:translate-x-3'
                  }`}
                >
                  {proj.title}
                </h2>

                {/* Right: Category */}
                <span
                  className={`font-sans text-sm sm:text-base text-[#1A1814]/50 font-light shrink-0 ml-8 transition-opacity duration-300 ${
                    hoveredProject && hoveredProject.id !== proj.id ? 'opacity-20' : 'opacity-100'
                  }`}
                >
                  {proj.category}
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </section>

      {/* WORK EXPERIENCE */}
      <section className="w-full px-8 sm:px-16 py-20 border-t border-[#1A1814]/10 relative z-20">
        <h2 className="text-left text-xl sm:text-2xl font-medium tracking-normal text-[#1A1814]/80 uppercase mb-10 sm:mb-12">
          Work Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: current availability */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group border border-[#1A1814]/15 bg-[radial-gradient(circle_at_top_right,_rgba(7,85,170,0.12),_transparent_42%),linear-gradient(145deg,_#BDB4AA,_#AAA097)] rounded-lg overflow-hidden shadow-[0_16px_36px_rgba(79,69,59,0.16)] hover:-translate-y-2 hover:border-[#0755AA]/50 hover:shadow-[0_22px_44px_rgba(79,69,59,0.22)] transition-all duration-500"
          >
            <div className="p-7 sm:p-9 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-4xl text-[#0755AA]/25">01</span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-[#0755AA] uppercase">Available</span>
                </div>
                <h4 className="mt-8 text-3xl sm:text-4xl text-[#1A1814] font-medium leading-[1.05] tracking-tight group-hover:text-[#0755AA] transition-colors">
                  Open to new<br />opportunities
                </h4>
                <p className="mt-5 text-xs text-[#1A1814]/50">From Aug 25, 2026 · Freelance welcome</p>
              </div>
              <div className="pt-10">
                <p className="text-sm text-[#1A1814]/70 leading-relaxed">Open to backend, ML, AI-agent, and full-stack roles, plus thoughtful freelance projects and collaborations.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: PalmMind */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group border border-[#1A1814]/15 bg-[radial-gradient(circle_at_top_right,_rgba(7,85,170,0.12),_transparent_42%),linear-gradient(145deg,_#BDB4AA,_#AAA097)] rounded-lg overflow-hidden shadow-[0_16px_36px_rgba(79,69,59,0.16)] hover:-translate-y-2 hover:border-[#0755AA]/50 hover:shadow-[0_22px_44px_rgba(79,69,59,0.22)] transition-all duration-500"
          >
            <div className="p-7 sm:p-9 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-4xl text-[#1A1814]/15">02</span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-[#1A1814]/45 uppercase">Mar — Aug 2026</span>
                </div>
                <h4 className="mt-8 text-3xl sm:text-4xl text-[#1A1814] font-medium leading-[1.05] tracking-tight group-hover:text-[#0755AA] transition-colors">
                  ML<br />Engineer
                </h4>
                <p className="mt-5 text-xs text-[#1A1814]/50">PalmMind Technology · Mar 31, 2026 — Aug 24, 2026</p>
              </div>
              <div className="pt-10">
                <p className="text-sm text-[#1A1814]/70 leading-relaxed">Worked on machine learning systems, data handling, model experiments, and practical AI features for real-world workflows.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Rhodora */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group border border-[#1A1814]/15 bg-[radial-gradient(circle_at_top_right,_rgba(7,85,170,0.1),_transparent_42%),linear-gradient(145deg,_#B4ABA1,_#9E958C)] rounded-lg overflow-hidden shadow-[0_16px_36px_rgba(79,69,59,0.16)] hover:-translate-y-2 hover:border-[#0755AA]/50 hover:shadow-[0_22px_44px_rgba(79,69,59,0.22)] transition-all duration-500"
          >
            <div className="p-7 sm:p-9 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-4xl text-[#1A1814]/15">03</span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-[#1A1814]/45 uppercase">Nov 2025 — Mar 2026</span>
                </div>
                <h4 className="mt-8 text-3xl sm:text-4xl text-[#1A1814] font-medium leading-[1.05] tracking-tight group-hover:text-[#0755AA] transition-colors">
                  Backend<br />Developer
                </h4>
                <p className="mt-5 text-xs text-[#1A1814]/50">Rhodora IT Solutions</p>
              </div>
              <div className="pt-10">
                <p className="text-sm text-[#1A1814]/70 leading-relaxed">Built backend services, APIs, database workflows, and reliable integrations for production-ready web systems.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PageEnd nextPage="playground" nextLabel="Explore" onNavigate={onNavigate} progress={transitionProgress} />

    </div>
  )
}

export default Work
