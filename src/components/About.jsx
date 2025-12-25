import { motion } from 'framer-motion'

const About = () => {
    // Use BASE_URL to correctly load assets from public folder when base path is set (e.g., /Portfolio/)
    const imagePath = `${import.meta.env.BASE_URL}image.jpg`;

    return (
        <div className="w-full h-full flex items-center justify-center overflow-auto md:overflow-hidden relative transition-colors duration-500 bg-cream dark:bg-dark-bg">

            {/* Container with top spacing and scale for desktop */}
            <div className="w-full h-full max-w-[1700px] flex flex-col md:flex-row px-6 md:px-12 lg:px-20 pt-24 md:pt-40 pb-20 relative md:scale-[0.8] origin-center">

                {/* LEFT SIDE: Text Content */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center space-y-8 md:space-y-12 z-10">
                    {/* Header Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-[5rem] md:text-[7rem] lg:text-[9.5rem] font-grand font-normal text-gray-900 dark:text-[#ECE7C1] leading-[0.85] tracking-tight">
                            About
                        </h2>

                        <h3 className="text-3xl md:text-5xl font-grand font-normal text-gray-800 dark:text-gray-200 leading-tight">
                            I'm Dipak. <br /> A developer, & <br /> problem solver.
                        </h3>
                    </motion.div>

                    {/* Divider Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="w-full h-[1px] bg-gray-900 dark:bg-gray-500 origin-left opacity-30"
                    />

                    {/* Bio Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-6 text-base md:text-lg font-montserrat font-light leading-relaxed text-gray-800 dark:text-gray-300 max-w-xl"
                    >
                        <p>
                            The cusp of art and technology has always fascinated me and I've never been afraid to just jump in and give it a go.
                        </p>
                        <p>
                            I've been designing with computers since the day I first opened MS Paint, and now I build robust digital experiences.
                        </p>
                    </motion.div>
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
