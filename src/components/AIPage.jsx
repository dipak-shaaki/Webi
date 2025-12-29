import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSend, IoArrowBack, IoSparkles, IoCheckmarkDoneSharp } from 'react-icons/io5'

const AIPage = ({ onBack }) => {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [relationship, setRelationship] = useState('stranger') // stranger, friend, work
    const [userName, setUserName] = useState(localStorage.getItem('dipak_ai_user_name') || null)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const handleSend = async (e, suggestedText = null) => {
        if (e) e.preventDefault()
        const textToSend = suggestedText || inputText
        if (!textToSend.trim() || isTyping) return

        const userMsg = {
            id: Date.now(),
            text: textToSend,
            isBot: false,
            time: formatTime(),
            status: 'read'
        }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: messages.slice(-10),
                    relationshipType: relationship,
                    userName: userName || 'Stranger'
                })
            });

            if (response.ok) {
                const data = await response.json();
                let cleanReply = data.reply;

                // Extract name if backend sent it via [[NAME:Name]]
                const nameMatch = cleanReply.match(/\[\[NAME:(.*?)\]\]/);
                if (nameMatch && nameMatch[1]) {
                    const detectedName = nameMatch[1].trim();
                    setUserName(detectedName);
                    localStorage.setItem('dipak_ai_user_name', detectedName);
                    cleanReply = cleanReply.replace(/\[\[NAME:.*?\]\]/, '').trim();
                }

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: cleanReply,
                    isBot: true,
                    time: formatTime()
                }]);
            } else {
                throw new Error('Backend offline');
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const fallback = "Under Construction. Feel free to reach out Dipak at shanki.dipak@gmail.com! ";
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: fallback,
                isBot: true,
                time: formatTime()
            }]);
        } finally {
            setIsTyping(false);
        }
    }

    const suggestions = [
        "What's your typical tech stack?",
        "Are you open to freelance work?",
        "Tell me about your favorite project.",
        "How do you handle complex bugs?"
    ]

    const relOptions = [
        { id: 'friend', label: 'I know Dipak' },
        { id: 'stranger', label: "I don't know Dipak" },
      
    ]

    return (
        <div className="w-full h-full bg-cream dark:bg-dark-bg flex flex-col relative overflow-hidden transition-colors duration-500 font-montserrat">

            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Left Floating Back Button - Commented out by User Choice */}
            {/* <div className="absolute top-6 left-6 md:top-8 md:left-24 z-[110] pointer-events-auto">
                <button
                    onClick={onBack}
                    className="p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white hover:scale-110 transition-all shadow-sm"
                >
                    <IoArrowBack size={20} />
                </button>
            </div> */}

            {/* Main Chat Container */}
            <div className="w-full max-w-2xl mx-auto h-full flex flex-col relative z-20 pt-20 pb-32 px-4 overflow-hidden">

                {/* Scrollable Chat Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="space-y-6 pb-12">
                        {messages.length === 0 ? (
                            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <h1 className="text-3xl md:text-5xl font-grand text-gray-900 dark:text-white leading-none italic">
                                            Dipak AI
                                        </h1>
                                        <p className="text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-[0.4em]">
                                            Digital Clone v1.0
                                        </p>
                                    </div>

                                    {/* Compact Relationship Selector */}
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {relOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setRelationship(opt.id)}
                                                className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${relationship === opt.id
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                                                    : 'bg-white/40 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700 text-gray-500 hover:bg-white dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(null, s)}
                                                className="p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl text-[11px] text-gray-400 hover:border-blue-500/30 transition-all text-center"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[80%] ${msg.isBot ? 'bg-white/90 dark:bg-gray-800/90' : 'bg-blue-600 text-white shadow-md'} backdrop-blur-md px-4 py-3 rounded-2xl border ${msg.isBot ? 'border-gray-100 dark:border-gray-700' : 'border-blue-500'}`}>
                                            <p className="text-xs md:text-[13px] leading-relaxed font-normal">
                                                {msg.text}
                                            </p>
                                            <div className="flex items-center justify-end gap-1.5 mt-1 opacity-60">
                                                <span className={`text-[7px] font-bold uppercase tracking-widest ${msg.isBot ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                                    {msg.time}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className={`text-[7px] font-bold uppercase tracking-widest ${msg.isBot ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                                        {msg.isBot ? 'Dipak' : (userName || 'You')}
                                                    </span>
                                                    {!msg.isBot && <IoCheckmarkDoneSharp size={10} className="text-blue-200" />}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-1">
                                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-100" />
                                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </>
                        )}
                    </div>
                </div>

                {/* Fixed Input Area */}
                <div className="absolute bottom-10 left-0 w-full px-4 z-30">
                    <div className="max-w-xl mx-auto flex flex-col gap-2">
                        {messages.length > 0 && (
                            <div className="flex justify-center">
                                <span className="text-[7px] bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full uppercase tracking-widest text-gray-400">
                                    {relOptions.find(o => o.id === relationship)?.label} {userName ? `(${userName})` : ''}
                                </span>
                            </div>
                        )}
                        <form
                            onSubmit={handleSend}
                            className="relative flex items-center group"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Message Dipak..."
                                className="w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-6 py-4 pr-16 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/30 shadow-2xl transition-all text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white rounded-xl transition-all shadow-lg"
                            >
                                <IoSend size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIPage;
