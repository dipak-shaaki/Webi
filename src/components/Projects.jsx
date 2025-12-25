import { motion } from 'framer-motion'
import { useState } from 'react'

const Projects = () => {
    const projects = [
        {
            id: 1,
            title: 'NEPAL WILDFIRE WATCH',
            category: 'GIS & REAL-TIME MONITORING',
            year: '2024',
            link: 'https://nepal-wildfire-watch.vercel.app/'
        },
        {
            id: 2,
            title: 'NAGARIK SAHAYOG',
            category: 'CITIZEN ASSISTANCE PLATFORM',
            year: '2024',
            link: 'https://github.com/dipak-shaaki/Nagarik-Sahayog'
        },
        {
            id: 3,
            title: 'MERN HOTEL RESERVATION',
            category: 'FULLSTACK WEB APPLICATION',
            year: '2023',
            link: 'https://mern-hotel-reservation.vercel.app'
        },
        {
            id: 4,
            title: 'SAMA FINAL',
            category: 'FULLSTACK DEVELOPMENT',
            year: '2024',
            link: 'https://github.com/dipak-shaaki/SAMA-Final'
        },
        {
            id: 5,
            title: 'BHETIYO',
            category: 'COMMUNITY SEARCH APP',
            year: '2023',
            link: 'https://github.com/dipak-shaaki/Bhetiyo'
        },
        {
            id: 6,
            title: 'CBANK DATA JOB SIM',
            category: 'DATA SCIENCE SIMULATION',
            year: '2024',
            link: 'https://github.com/dipak-shaaki/CommonwealthBank_DataScience_Job_Simulation_forage'
        },
    ]

    const [hoveredId, setHoveredId] = useState(null)

    const handleProjectClick = (link) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center gap-8 md:gap-20 px-6 md:px-16 pt-20 md:pt-0 pb-16 max-w-[1700px] mx-auto overflow-hidden md:scale-[0.8] origin-center">

            {/* LEFT SIDE: Static Content */}
            <div className="w-full md:w-1/3 flex flex-col justify-center space-y-6 md:space-y-12 shrink-0 pt-12 md:pt-0">
                {/* Label - GrandSlang */}
                <h2 className="text-2xl md:text-4xl font-grand uppercase text-gray-900 dark:text-white font-normal text-left tracking-wide">
                    Work
                </h2>

                {/* Description - Montserrat (Darker Color) */}
                <div className="space-y-6 font-montserrat text-gray-800 dark:text-gray-300 leading-relaxed text-base md:text-lg max-w-md text-left font-light">
                    <p>
                        This is a showcase of my best work in a variety of fields including Fullstack Development, Data Science, and Community-driven solutions.
                    </p>
                    <p className="hidden md:block">
                        Most of these projects are open-source and represent my journey in modular software architecture and real-world problem solving.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: List - Vertical Scroll on Desktop, Stacked on Mobile */}
            <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar mask-gradient pb-20 md:pb-0">
                <div className="space-y-8 md:space-y-16 pt-8 md:pt-24 pl-0 md:pl-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            onMouseEnter={() => setHoveredId(project.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleProjectClick(project.link)}
                            className="group cursor-pointer flex flex-col items-start"
                        >
                            {/* Title - GrandSlang */}
                            <h3 className={`text-4xl md:text-7xl font-grand font-normal uppercase transition-all duration-500 leading-tight ${hoveredId === project.id
                                ? 'text-gray-900 dark:text-white italic translate-x-4'
                                : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {project.title}
                            </h3>

                            {/* Category - Montserrat */}
                            <div className="mt-2 md:mt-3 flex items-center gap-4 text-xs md:text-sm font-montserrat tracking-widest uppercase text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-4">
                                <span>— {project.category}</span>
                            </div>
                        </motion.div>
                    ))}

                    <div className="h-24 hidden md:block"></div>
                </div>
            </div>

        </div>
    )
}

export default Projects
