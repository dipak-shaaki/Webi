import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSend, IoClose } from 'react-icons/io5'

const ChatBot = ({ isOpen, onToggle }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm Dipak's virtual assistant. Ask me anything! 👋",
            isBot: true
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen, isTyping])

    const handleSend = async (e, customText = null) => {
        if (e) e.preventDefault()
        const text = customText || inputText
        if (!text.trim()) return

        // 1. Add User Message
        const userMsg = { id: Date.now(), text: text, isBot: false }
        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        // 2. Simulate Bot Response
        setTimeout(() => {
            const botResponse = generateResponse(userMsg.text)
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }])
            setIsTyping(false)
        }, 1000)
    }

    const generateResponse = (text) => {
        const lower = text.toLowerCase()

        // 1. "Let's do this" / Work inquiry -> Mail me
        if (lower.includes("let's do") || lower.includes("lets do") || lower.includes("hire") || lower.includes("project")) {
            return (
                <span>
                    Sounds like a plan! 🚀 <a href="mailto:your-email@outlook.com" className="underline font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800">Mail me</a> and let's make it happen.
                </span>
            )
        }

        // 2. "Tell me about yourself" -> Humorous
        if (lower.includes("about yourself") || lower.includes("who are you")) {
            return "I'm a designer who turns coffee into code and confusion into clarity. ☕️✨ I spend half my time aligning pixels and the other half wondering why 'divs' won't center. But hey, it looks good in the end!"
        }

        // Default responses
        if (lower.includes('hello') || lower.includes('hi'))
            return "Hello there! How can I help you today?"

        if (lower.includes('price') || lower.includes('cost'))
            return "My rates are like my designs: premium but worth every penny. Mail me for a quote!"

        return "That's interesting! Why don't you mail me to discuss it further?"
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[92vw] md:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-100 dark:border-gray-800 font-sans"
                >
                    {/* Header */}
                    <div className="bg-gray-900 dark:bg-gray-800 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold font-serif text-lg">D</div>
                            <div>
                                <h3 className="font-bold text-sm">Dipak Bot</h3>
                                <p className="text-xs text-gray-400">Online • Replies jokingly</p>
                            </div>
                        </div>
                        <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <IoClose size={24} />
                        </button>
                    </div>

                    {/* Messages Area - Hid Scrollbar */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${msg.isBot ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    {msg.isBot ? 'DB' : 'You'}
                                </div>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isBot ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs shrink-0">DB</div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 ml-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask me something..."
                                className="flex-1 bg-transparent text-gray-900 dark:text-white focus:outline-none text-sm"
                            />
                            <button type="submit" disabled={!inputText.trim()} className="p-1.5 bg-blue-600 text-white rounded-full hover:scale-105 transition-all">
                                <IoSend size={16} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ChatBot
