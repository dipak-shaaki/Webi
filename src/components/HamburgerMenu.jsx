import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const HamburgerMenu = ({ isOpen, onClose, onNavigate, currentView }) => {
    const menuItems = [
       // Added HOME for easy return
        { name: 'WORK', view: 'work' },
        { name: 'ABOUT', view: 'about' },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-50 bg-cream dark:bg-dark-bg flex items-center justify-center p-4"
                >
                    {/* Close overlay */}
                    <div className="absolute inset-0" onClick={onClose} />

                    {/* Main Navigation */}
                    <nav className="relative z-50 flex flex-col items-center gap-6 md:gap-12 pointer-events-none w-full">
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                                className={`pointer-events-auto text-4xl md:text-8xl font-grand font-normal hover:italic transition-all duration-300 ${currentView === item.view
                                        ? 'text-gray-900 dark:text-white italic'
                                        : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </motion.button>
                        ))}

                        <motion.button
                            onClick={() => {
                                onClose();
                                onNavigate('contact');
                            }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="pointer-events-auto text-4xl md:text-8xl font-grand font-normal text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:italic transition-all duration-300"
                        >
                            CONTACT
                        </motion.button>
                    </nav>

                    {/* Theme Toggle - Mobile Only */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-10 right-10 z-[60] pointer-events-auto flex flex-col items-center gap-2 md:hidden"
                    >
                        <ThemeToggle className="!w-12 !h-12 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow-xl" />
                        <span className="text-[10px] font-montserrat uppercase tracking-widest text-gray-500">Theme</span>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default HamburgerMenu
