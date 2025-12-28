import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiInstagram, FiArrowLeft } from 'react-icons/fi'

const Sidebar = ({ currentView, onNavigate }) => {
    const socialLinks = [
        { icon: FiGithub, href: 'https://github.com/dipak-shaaki', label: 'GitHub' },
        { icon: FiLinkedin, href: 'https://www.linkedin.com/in/dipak-shanki/', label: 'LinkedIn' },
        { icon: FiInstagram, href: 'https://www.instagram.com/dipak.shaki/', label: 'Instagram' },
    ]

    return (
        <motion.footer
            className="fixed bottom-0 left-0 w-full z-40 px-6 md:px-12 py-6 md:py-8 flex justify-between items-center bg-transparent pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Left side spacer - to keep socials centered */}
            <div className="flex-1 hidden md:block" />

            {/* Center: Socials or Back to Home */}
            <div className="pointer-events-auto flex items-center justify-center flex-1">
                <AnimatePresence mode="wait">
                    {currentView === 'home' ? (
                        <motion.div
                            key="socials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-6 md:gap-8"
                        >
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                                >
                                    <link.icon size={16} />
                                </motion.a>
                            ))}
                        </motion.div>
                    ) : currentView !== 'chat' ? (
                        <motion.button
                            key="back-home"
                            onClick={() => onNavigate('home')}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2 group text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                        >
                            <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[11px] font-montserrat tracking-[0.2em] uppercase">
                                Back to Home
                            </span>
                        </motion.button>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Right side spacer */}
            <div className="flex-1 hidden md:block" />
        </motion.footer>
    )
}

export default Sidebar
