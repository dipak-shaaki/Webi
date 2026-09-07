import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageEnd from './PageEnd'

const Workflow = ({ currentPage, onNavigate }) => {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const stepARef = useRef(null)
  const stepBRef = useRef(null)
  const stepCRef = useRef(null)
  const implRef = useRef(null)

  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasAutoTransitioned, setHasAutoTransitioned] = useState(false)
  const scrollDeltaRef = useRef(0)
  const decayTimeoutRef = useRef(null)

  /* hero parallax */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef, container: containerRef,
    offset: ['start start', 'end start'],
  })
  const heroTitleY = useTransform(heroScroll, [0, 1], [0, -100])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  /* overscroll → contact */
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    let lastTouchY = null
    const handler = (e) => {
      if (hasAutoTransitioned) return
      const atBottom = c.scrollHeight - c.scrollTop - c.clientHeight <= 15
      if (atBottom && e.deltaY > 0) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
        scrollDeltaRef.current += e.deltaY
        const pct = Math.min((scrollDeltaRef.current / 1200) * 100, 100)
        setTransitionProgress(pct)
        if (pct >= 100) { setHasAutoTransitioned(true); setTimeout(() => onNavigate?.('contact'), 150) }
        else { decayTimeoutRef.current = setTimeout(() => { scrollDeltaRef.current = 0; setTransitionProgress(0) }, 250) }
      } else if (e.deltaY < 0) {
        if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
        scrollDeltaRef.current = 0; setTransitionProgress(0)
      }
    }
    const handleTouchStart = (event) => { lastTouchY = event.touches[0]?.clientY ?? null }
    const handleTouchMove = (event) => {
      const touchY = event.touches[0]?.clientY
      if (lastTouchY === null || touchY === undefined) return
      handler({ deltaY: (lastTouchY - touchY) * 4 })
      lastTouchY = touchY
    }
    c.addEventListener('wheel', handler, { passive: true })
    c.addEventListener('touchstart', handleTouchStart, { passive: true })
    c.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      c.removeEventListener('wheel', handler)
      c.removeEventListener('touchstart', handleTouchStart)
      c.removeEventListener('touchmove', handleTouchMove)
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
    }
  }, [hasAutoTransitioned, onNavigate])

  /* shared animation variants */
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none scroll-smooth relative">

      {/* ═══ STANDARDIZED CLEAN HEADER ═══ */}
      <header className="sticky top-0 inset-x-0 h-[76px] sm:h-[104px] pt-4 sm:pt-8 pb-6 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-50 bg-transparent relative">
        <div className="flex gap-4 sm:gap-10 md:gap-24">
        <button onClick={() => onNavigate?.('info')} className="text-left focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">About</h2>
        </button>
        <button onClick={() => onNavigate?.('work')} className="text-left justify-self-center focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Work</h2>
        </button>
        </div>
        <div className="fixed left-[46%] -translate-x-1/2 top-3 sm:left-1/2 sm:top-9 z-[60]">
          <button onClick={() => onNavigate?.('home')} className="text-[10px] whitespace-nowrap tracking-[0.12em] text-[#1A1814]/50 hover:text-[#1A1814] transition-colors uppercase focus:outline-none cursor-pointer">HOME</button>
        </div>
        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-10 md:gap-24">
        <button onClick={() => onNavigate?.('playground')} className="justify-self-center text-left focus:outline-none cursor-pointer">
          <h2 className={`text-lg sm:text-3xl whitespace-nowrap leading-none font-medium ${currentPage === 'playground' ? 'text-[#0755AA] underline underline-offset-8 decoration-2' : 'text-[#1A1814]'}`}>Explore</h2>
        </button>
        <button onClick={() => onNavigate?.('contact')} className="justify-self-end text-left focus:outline-none cursor-pointer">
          <h2 className="text-lg sm:text-3xl whitespace-nowrap text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Contact</h2>
        </button>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative w-full min-h-[90vh] flex flex-col justify-center px-8 sm:px-16 py-16">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Main Title */}
          <div className="mb-16">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-normal text-[#1A1814] tracking-tight leading-[0.95]" style={{ fontFamily: 'Georgia, serif' }}>
              It's all about my <span className="italic font-light text-[#0755AA]">process</span>
            </h1>
            <div className="flex items-baseline gap-6 mt-4 flex-wrap">
              <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] italic font-light text-[#1A1814] tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                working &rarr;
              </span>
              <span className="font-mono text-xs tracking-widest text-[#1A1814]/50 uppercase pl-2">
                *How the work works
              </span>
            </div>
          </div>

          {/* Steps Overview */}
          <div className="flex flex-wrap items-baseline gap-12 sm:gap-20 pt-10 border-t border-[#1A1814]/15">
            {[
              { num: 'A', name: 'Understand' },
              { num: 'B', name: 'Build' },
              { num: 'C', name: 'Deliver' }
            ].map((step) => (
              <div key={step.num} className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[#0755AA] font-semibold">{step.num}.</span>
                <span className="text-3xl sm:text-4xl text-[#1A1814] font-normal tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ SECTION A — UNDERSTAND (LEFT ALIGNED) ═══ */}
      <section ref={stepARef} className="relative w-full min-h-[85vh] flex items-center py-24 sm:py-32 border-t border-[#1A1814]/10">
        <div className="relative z-10 w-full px-8 sm:px-16 max-w-6xl mx-auto flex flex-col items-start">
          
          <div className="max-w-2xl text-left">
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-[#0755AA] font-semibold">A.</span>
              <span className="w-12 h-[1px] bg-[#0755AA]" />
              <span className="font-mono text-xs tracking-[0.3em] text-[#1A1814]/40 uppercase">01</span>
            </motion.div>

            <motion.h2 {...fadeUp(0.1)} className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-[#1A1814] leading-[0.9] mb-4">
              Understand
            </motion.h2>

            <motion.h3 {...fadeUp(0.15)} className="text-2xl sm:text-3xl text-[#1A1814]/70 font-normal italic mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Discovery & Foundations
            </motion.h3>

            <motion.p {...fadeUp(0.2)} className="text-lg sm:text-2xl text-[#1A1814]/85 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
              Every good project starts with understanding the core problem rather than jumping straight into technology. I take the time to deeply discover your business goals, end-user expectations, data requirements, existing tech stack, constraints, and scope &mdash; ensuring we answer the fundamental question: what are we solving, and for whom.
            </motion.p>
          </div>

        </div>
      </section>

      {/* ═══ SECTION B — BUILD (RIGHT ALIGNED) ═══ */}
      <section ref={stepBRef} className="relative w-full min-h-[85vh] flex items-center py-24 sm:py-32 bg-[#E8E5DE] border-t border-[#1A1814]/10">
        <div className="relative z-10 w-full px-8 sm:px-16 max-w-6xl mx-auto flex flex-col items-end">
          
          <div className="max-w-2xl text-left md:text-right">
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-6 md:justify-end">
              <span className="font-mono text-xs tracking-[0.3em] text-[#1A1814]/40 uppercase">02</span>
              <span className="w-12 h-[1px] bg-[#0755AA]" />
              <span className="font-mono text-sm text-[#0755AA] font-semibold">B.</span>
            </motion.div>

            <motion.h2 {...fadeUp(0.1)} className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-[#1A1814] leading-[0.9] mb-4">
              Build
            </motion.h2>

            <motion.h3 {...fadeUp(0.15)} className="text-2xl sm:text-3xl text-[#1A1814]/70 font-normal italic mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Where the thinking becomes structure
            </motion.h3>

            <motion.p {...fadeUp(0.2)} className="text-lg sm:text-2xl text-[#1A1814]/85 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
              Every system starts with a plan, not code. I map out the overall system architecture, design data flows, test early assumptions, and evaluate key model trade-offs &mdash; deciding what requires intelligent AI components versus what should remain simple, robust, and reliable.
            </motion.p>
          </div>

        </div>
      </section>

      {/* ═══ SECTION C — DELIVER (LEFT ALIGNED) ═══ */}
      <section ref={stepCRef} className="relative w-full min-h-[85vh] flex items-center py-24 sm:py-32 border-t border-[#1A1814]/10">
        <div className="relative z-10 w-full px-8 sm:px-16 max-w-6xl mx-auto flex flex-col items-start">
          
          <div className="max-w-2xl text-left">
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-[#0755AA] font-semibold">C.</span>
              <span className="w-12 h-[1px] bg-[#0755AA]" />
              <span className="font-mono text-xs tracking-[0.3em] text-[#1A1814]/40 uppercase">03</span>
            </motion.div>

            <motion.h2 {...fadeUp(0.1)} className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-[#1A1814] leading-[0.9] mb-4">
              Deliver
            </motion.h2>

            <motion.h3 {...fadeUp(0.15)} className="text-2xl sm:text-3xl text-[#1A1814]/70 font-normal italic mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Architecture, Models, Interface
            </motion.h3>

            <motion.p {...fadeUp(0.2)} className="text-lg sm:text-2xl text-[#1A1814]/85 leading-relaxed font-normal" style={{ fontFamily: 'Georgia, serif' }}>
              A product has to hold up under production stress while feeling effortless to the end user. By staying closely involved across every layer &mdash; structure, intelligence, and interface &mdash; both sides are built and deployed as one connected system.
            </motion.p>
          </div>

        </div>
      </section>

      {/* ═══ SECTION 04 — DELIVERY (RIGHT ALIGNED, DARK SECTION) ═══ */}
      <section ref={implRef} className="relative w-full py-28 sm:py-36 bg-[#1A1814] text-[#C6BEB5] border-t border-[#1A1814]/10">
        <div className="w-full px-8 sm:px-16 max-w-6xl mx-auto flex flex-col items-end">
          
          <div className="max-w-2xl text-left md:text-right">
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-6 md:justify-end">
              <span className="font-mono text-xs tracking-[0.3em] text-[#0755AA] uppercase font-semibold">04</span>
              <span className="w-12 h-[1px] bg-[#0755AA]" />
            </motion.div>

            <motion.h2 {...fadeUp(0.1)} className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-[#C6BEB5] leading-[0.9] mb-4">
              Delivery Stage
            </motion.h2>

            <motion.h3 {...fadeUp(0.15)} className="text-2xl sm:text-3xl text-[#C6BEB5]/70 font-normal italic mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              From data to production
            </motion.h3>

            <motion.p {...fadeUp(0.2)} className="text-lg sm:text-2xl text-[#C6BEB5]/85 leading-relaxed font-normal mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              The deployment phase moves the project from development into the real world. This encompasses data preparation, model development, backend and API construction, frontend integration, rigorous testing, launch, and post-launch monitoring.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="pt-8 border-t border-[#C6BEB5]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h4 className="text-2xl text-[#C6BEB5] font-normal" style={{ fontFamily: 'Georgia, serif' }}>
                Let's build something real.
              </h4>

              <button
                onClick={() => onNavigate?.('contact')}
                className="text-lg text-[#C6BEB5] hover:text-[#0755AA] transition-colors cursor-pointer font-medium underline underline-offset-8"
              >
                Contact me &rarr;
              </button>
            </motion.div>
          </div>

        </div>
      </section>

      <PageEnd nextPage="contact" nextLabel="Contact" onNavigate={onNavigate} progress={transitionProgress} />
    </div>
  )
}

export default Workflow
