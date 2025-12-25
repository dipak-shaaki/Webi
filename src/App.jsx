import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import HamburgerMenu from './components/HamburgerMenu'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import { FiX } from 'react-icons/fi'

// Loading Component
const LoadingScreen = () => (
    <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[60] bg-cream dark:bg-dark-bg flex flex-col items-center justify-center pointer-events-none"
    >
        <div className="overflow-hidden">
            <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-grand font-normal italic text-gray-900 dark:text-white"
            >
                Loading...
            </motion.h1>
        </div>
    </motion.div>
)

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [currentView, setCurrentView] = useState('home')

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const navigate = (view) => {
        setCurrentView(view)
        setIsMenuOpen(false)
    }

    return (
        <div className="fixed inset-0 bg-cream dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-500 overflow-hidden font-sans">
            <AnimatePresence>
                {isLoading && <LoadingScreen key="loading" />}
            </AnimatePresence>

            {!isLoading && (
                <>
                    {/* Sidebar */}
                    <Sidebar currentView={currentView} onNavigate={navigate} />

                    {/* Top Left: Profile Avatar */}
                    <div className="fixed top-6 left-6 md:top-8 md:left-8 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-300"
                            onClick={() => navigate('home')}
                        >
                            <img src={`${import.meta.env.BASE_URL}hunxa.jpg`} alt="Dipak" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>

                    {/* Top Right: Hamburger Menu */}
                    <div className="fixed top-6 right-6 md:top-8 md:right-8 z-[100]">
                        <motion.button
                            key="menu-btn"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={toggleMenu}
                            className="w-10 h-10 flex items-center justify-center group relative"
                            aria-label="Menu"
                        >
                            <div className="flex flex-col gap-[5px] items-end">
                                <motion.span
                                    animate={isMenuOpen ? { rotate: 45, y: 6.5, width: '22px' } : { rotate: 0, y: 0, width: '22px' }}
                                    className="h-[1.5px] bg-gray-900 dark:bg-white transition-all duration-300 origin-center"
                                />
                                <motion.span
                                    animate={isMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0, width: '12px' }}
                                    className="h-[1.5px] bg-gray-900 dark:bg-white transition-all duration-300"
                                />
                                <motion.span
                                    animate={isMenuOpen ? { rotate: -45, y: -6.5, width: '22px' } : { rotate: 0, y: 0, width: '18px' }}
                                    className="h-[1.5px] bg-gray-900 dark:bg-white transition-all duration-300 origin-center"
                                />
                            </div>
                        </motion.button>
                    </div>

                    {/* Full Screen Menu */}
                    <HamburgerMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        onNavigate={navigate}
                        currentView={currentView}
                    />

                    {/* Main Content Area */}
                    <main className="absolute inset-0 flex items-center justify-center p-0 overflow-x-hidden md:overflow-visible pointer-events-none">
                        {/* Added overflow-x-hidden to prevent horizontal scrolling */}
                        <div className="w-full h-full max-w-[1600px] flex items-center justify-center pointer-events-auto">
                            <AnimatePresence mode="wait">
                                {currentView === 'home' && (
                                    <motion.div
                                        key="home"
                                        className="w-full h-full flex items-center justify-center overflow-auto md:overflow-visible"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Hero
                                            onWorkClick={() => navigate('work')}
                                            onAboutClick={() => navigate('about')}
                                        />
                                    </motion.div>
                                )}

                                {currentView === 'work' && (
                                    <motion.div
                                        key="work"
                                        className="w-full h-full md:h-[80vh] flex flex-col justify-center pt-12 md:pt-0 overflow-auto md:overflow-visible"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Projects />
                                    </motion.div>
                                )}

                                {currentView === 'about' && (
                                    <motion.div
                                        key="about"
                                        className="w-full h-full flex flex-col items-center justify-center overflow-auto md:overflow-visible"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <About />
                                    </motion.div>
                                )}

                                {currentView === 'contact' && (
                                    <motion.div
                                        key="contact"
                                        className="w-full h-full flex flex-col items-center justify-center overflow-auto md:overflow-visible"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Contact />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                </>
            )}
        </div>
    )
}

export default App
