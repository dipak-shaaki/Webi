import { motion } from 'framer-motion'

const About = () => {
    // Use BASE_URL to correctly load assets from public folder when base path is set (e.g., /Portfolio/)
    const imagePath = `${import.meta.env.BASE_URL}image.jpg`;

    return (
        <div className="w-full h-full flex items-center justify-center relative transition-colors duration-500 bg-cream dark:bg-dark-bg">

            {/* Container with top spacing and scale for desktop */}
            <div className="w-full h-full max-w-[1700px] flex flex-col md:flex-row px-6 md:px-12 lg:px-20 pt-32 md:pt-20 pb-16 relative md:scale-[0.8] origin-center">

                {/* LEFT SIDE: Text Content */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center space-y-6 md:space-y-8 z-10">
                    {/* Header Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h2 className="text-[3.5rem] md:text-[7rem] lg:text-[9.5rem] font-grand font-normal text-gray-900 dark:text-[#ECE7C1] leading-[0.85] tracking-tight">
                            About
                        </h2>

                        <h3 className="text-3xl md:text-5xl font-grand font-normal text-gray-800 dark:text-gray-200 leading-tight">
                            I'm Dipak — A developer, <br className="hidden md:block" /> thinker & problem solver.
                        </h3>
                    </motion.div>

                    {/* Divider Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="w-full h-[1px] bg-gray-900 dark:bg-gray-500 origin-left opacity-30"
                    />

                    <div className="space-y-6">
                        <div className="space-y-4 text-base md:text-lg font-montserrat font-light leading-relaxed text-gray-800 dark:text-gray-300 max-w-xl text-justify">
                            <p>
                                I’m a MERN & SERN stack developer with a deep interest in AI, ML, and Data Science. The intersection of creativity and technology has always fascinated me, and I’m never afraid to dive in, experiment, and learn by doing.
                            </p>
                            <p>
                                From early curiosity with code to building scalable, data-driven applications, I focus on creating robust digital experiences that solve real-world problems.
                            </p>
                        </div>

                        <motion.a
                            href={`${import.meta.env.BASE_URL}resume.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            type="application/pdf"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="relative inline-block font-montserrat text-sm tracking-[0.3em] uppercase text-gray-900 dark:text-white group cursor-pointer w-max"
                        >
                            <span className="relative z-10">View CV</span>
                            <div className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-gray-900 dark:bg-white scale-x-100 group-hover:scale-x-50 transition-transform duration-500 origin-left" />
                        </motion.a>
                    </div>
                </div>

                {/* RIGHT SIDE: Image */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-end py-12 md:py-0"
                >
                    <div className="relative w-full aspect-[4/5] md:h-[75vh] md:w-auto overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-sm">
                        <img
                            src={imagePath}
                            alt="Dipak Portrait"
                            className="w-full h-full object-cover"
                            onLoad={() => console.log("Image loaded successfully from:", imagePath)}
                            onError={(e) => {
                                console.error("Failed to load image from:", imagePath);
                                e.target.onerror = null;
                                // External fallback
                                e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop";
                            }}
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default About
