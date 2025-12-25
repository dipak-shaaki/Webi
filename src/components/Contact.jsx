import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
    })

    const [status, setStatus] = useState('idle') // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (status === 'submitting' || status === 'success') return

        setStatus('submitting')

        try {
            // Using the direct email endpoint (no /f/) which is more reliable for simple setups
            const response = await fetch('https://formspree.io/shanki.dipak@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', service: '', message: '' })
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                const data = await response.json()
                console.error('Submission error:', data)
                setStatus('error')
                setTimeout(() => setStatus('idle'), 4000)
            }
        } catch (error) {
            console.error('Submission error:', error)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 4000)
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center relative bg-cream dark:bg-dark-bg transition-colors duration-500">

            {/* Main Container */}
            <div className="w-full h-full max-w-[1700px] flex flex-col md:flex-row px-4 md:px-12 pt-16 md:pt-20 pb-16 relative md:scale-[0.8] origin-center">

                {/* LEFT SIDE: The Form */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-4 md:px-12 order-2 md:order-1 pt-6 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-lg"
                    >
                        <h2 className="text-3xl md:text-6xl font-grand font-normal text-gray-900 dark:text-white leading-tight mb-8">
                            Have a project <br /> in mind?
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {[
                                { id: 'name', label: '01 — What\'s your name?', placeholder: 'Enter your name *', type: 'text' },
                                { id: 'email', label: '02 — What\'s your email?', placeholder: 'Enter your email address *', type: 'email' },
                                { id: 'service', label: '04 — What\'s on your mind?', placeholder: 'Project idea, Work collaboration...', type: 'text' },
                                { id: 'message', label: '05 — Your message', placeholder: 'Hello Dipak, can you help me with...', type: 'textarea' },
                            ].map((field) => (
                                <div key={field.id} className="group relative">
                                    <label htmlFor={field.id} className="block text-xs md:text-sm font-montserrat text-gray-500 mb-1">
                                        {field.label}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            id={field.id}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            required
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-base md:text-lg font-montserrat text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all resize-none !bg-opacity-0 autofill:!bg-transparent"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            required
                                            autoComplete="off"
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 text-base md:text-lg font-montserrat text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-0 focus:border-gray-900 dark:focus:border-white transition-all !bg-opacity-0 autofill:!bg-transparent"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 flex flex-col items-start gap-4">
                                <motion.button
                                    type="submit"
                                    disabled={status === 'submitting' || status === 'success'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative h-14 md:h-16 px-10 md:px-14 rounded-full font-montserrat font-medium text-base md:text-lg transition-all duration-500 ${status === 'success'
                                        ? 'bg-green-600 text-white w-full md:w-48'
                                        : status === 'error'
                                            ? 'bg-red-600 text-white w-full md:w-64'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto'
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {status === 'idle' && <motion.span key="idle">Send Message</motion.span>}
                                        {status === 'submitting' && (
                                            <motion.span key="submitting" className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </motion.span>
                                        )}
                                        {status === 'success' && <motion.span key="success">✔ Sent!</motion.span>}
                                        {status === 'error' && <motion.span key="error">Check email to activate!</motion.span>}
                                    </AnimatePresence>
                                </motion.button>

                                {status === 'error' && (
                                    <p className="text-[10px] font-montserrat text-red-500 bg-white/10 p-2 rounded">
                                        Formspree sent an "Activation" email to **shanki.dipak@gmail.com**. <br />
                                        Open it and click "Active" for the form to work.
                                    </p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* RIGHT SIDE: Info */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-4 md:px-12 order-1 md:order-2 space-y-8 mt-12 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-[4rem] md:text-[7rem] lg:text-[9rem] font-grand font-normal text-gray-900 dark:text-[#ECE7C1] leading-[0.8] mb-8">
                            Hello.
                        </h1>

                        <div className="space-y-6 font-montserrat font-light text-gray-800 dark:text-gray-300 text-base md:text-lg max-w-md leading-relaxed">
                            <p>
                                Need a beautiful, well-structured website that you can own and maintain yourself? Get in touch.
                            </p>

                            <div className="space-y-1 pt-4">
                                <p className="font-medium text-gray-500 text-xs uppercase tracking-wide mb-1">Email:</p>
                                <a href="mailto:shanki.dipak@gmail.com" className="block text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-0.5 w-max hover:opacity-70 transition-opacity">
                                    shanki.dipak@gmail.com
                                </a>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {['LinkedIn', 'Dribbble', 'Github'].map(link => (
                                    <a key={link} href="#" className="text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-0.5 hover:opacity-70 transition-opacity font-montserrat text-sm">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    )
}

export default Contact
