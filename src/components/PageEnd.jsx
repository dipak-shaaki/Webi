import React from 'react'
import SocialFooter from './SocialFooter'

const PageEnd = ({ nextPage, nextLabel, onNavigate, progress = 0 }) => (
  <section className="w-full border-t border-[#1A1814]/15 bg-[#C6BEB5] px-5 py-10 sm:px-16 sm:py-16">
      <div className="flex flex-col gap-9 sm:gap-12">
        <div className="flex items-start justify-between font-mono text-[9px] sm:text-xs tracking-widest text-[#1A1814]/50 uppercase">
          <span className="leading-tight">Keep scrolling<br />to next page</span>
          <button onClick={() => onNavigate?.(nextPage)} className="flex items-center gap-3 transition-colors hover:text-[#0755AA]">
            <span>Next page</span>
            <span className="h-[2px] w-16 overflow-hidden bg-[#1A1814]/15 sm:w-28">
              <span className="block h-full bg-[#0755AA] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </span>
            <span>→</span>
          </button>
        </div>

        <button onClick={() => onNavigate?.(nextPage)} className="w-fit text-left text-5xl font-bold leading-none tracking-tight text-[#1A1814] uppercase transition-colors hover:text-[#0755AA] sm:text-7xl md:text-8xl">
          {nextLabel}
        </button>

        <SocialFooter />
      </div>
  </section>
)

export default PageEnd
