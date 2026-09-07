import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AiConcierge = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('text') // 'text' | 'voice'
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello. I am the AI Concierge. How can I assist you today?' }
  ])
  const [isListening, setIsListening] = useState(false)
  
  const endOfMessagesRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: inputText }])
    setInputText('')
    // Placeholder for backend AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Under construction. Will be available soon.' }])
    }, 1000)
  }

  const toggleListen = () => {
    setIsListening(!isListening)
    // Hook up voice backend trigger here
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1814]/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#E8E5DE] shadow-2xl z-[101] flex flex-col border-l border-[#1A1814]/10"
          >
            {/* Header */}
            <div className="px-6 py-8 border-b border-[#1A1814]/10 flex justify-between items-center bg-[#E8E5DE]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#0755AA] animate-pulse" />
                <h2 className="font-mono text-xs tracking-[0.2em] text-[#1A1814] uppercase">AI Concierge</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-[#1A1814]/5 text-[#1A1814]/60 hover:text-[#1A1814] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-2 bg-[#C6BEB5]/30">
              <button
                onClick={() => setMode('text')}
                className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-all ${
                  mode === 'text' ? 'bg-[#1A1814] text-[#E8E5DE] shadow-sm' : 'text-[#1A1814]/50 hover:text-[#1A1814]'
                }`}
              >
                Text Chat
              </button>
              <button
                onClick={() => setMode('voice')}
                className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase transition-all ${
                  mode === 'voice' ? 'bg-[#1A1814] text-[#E8E5DE] shadow-sm' : 'text-[#1A1814]/50 hover:text-[#1A1814]'
                }`}
              >
                Voice
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-[#E8E5DE]">
              <AnimatePresence mode="wait">
                {mode === 'text' ? (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-[#1A1814] text-[#E8E5DE] rounded-2xl rounded-tr-sm'
                                : 'bg-[#C6BEB5]/40 text-[#1A1814] rounded-2xl rounded-tl-sm border border-[#1A1814]/5'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      <div ref={endOfMessagesRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSend} className="p-4 border-t border-[#1A1814]/10 bg-[#E8E5DE]">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Ask me anything..."
                          className="w-full bg-[#C6BEB5]/30 border border-[#1A1814]/20 rounded-full py-3 px-5 pr-12 text-sm text-[#1A1814] placeholder:text-[#1A1814]/40 focus:outline-none focus:border-[#0755AA] transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!inputText.trim()}
                          className="absolute right-2 w-8 h-8 flex justify-center items-center rounded-full bg-[#1A1814] text-[#E8E5DE] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0755AA] transition-colors"
                        >
                          ↑
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="voice"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col items-center justify-center p-8"
                  >
                    {/* Abstract Voice Visualizer */}
                    <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
                      {isListening ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-full bg-[#0755AA]/20"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="absolute inset-4 rounded-full bg-[#0755AA]/40"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-8 rounded-full border border-[#1A1814]/10" />
                      )}
                      
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${isListening ? 'bg-[#0755AA]' : 'bg-[#1A1814]'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8E5DE" strokeWidth="1.5">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl text-[#1A1814] font-medium mb-2">
                      {isListening ? "Listening..." : "Voice Assistant"}
                    </h3>
                    <p className="text-sm text-[#1A1814]/50 text-center mb-10 max-w-xs">
                      {isListening 
                        ? "Speak now. I'll analyze and respond." 
                        : "Tap the button below to start a voice conversation."}
                    </p>

                    <button
                      onClick={toggleListen}
                      className={`px-8 py-4 rounded-full font-mono text-[10px] tracking-widest uppercase transition-colors ${
                        isListening 
                          ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' 
                          : 'bg-[#1A1814] text-[#E8E5DE] hover:bg-[#0755AA]'
                      }`}
                    >
                      {isListening ? "STOP LISTENING" : "START SPEAKING"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AiConcierge
