import React from 'react'

const SocialFooter = () => (
  <footer className="w-full px-4 sm:px-8 md:px-16 py-6 sm:py-8 flex flex-wrap justify-center items-center gap-6 sm:gap-16 border-t border-[#1A1814]/10">
    {[
      { label: 'GitHub', url: 'https://github.com/dipak-shaaki' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/dipak-shanki/' },
      { label: 'Instagram', url: 'https://www.instagram.com/dipak.shaaki/' },
    ].map((social) => (
      <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="text-sm sm:text-base md:text-lg text-[#1A1814]/50 hover:text-[#1A1814] transition-colors duration-300 hover:underline underline-offset-4">
        {social.label}
      </a>
    ))}
  </footer>
)

export default SocialFooter
