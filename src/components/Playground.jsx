import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PageEnd from './PageEnd'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const fallbackQuestions = [
  { id: 'relationship', prompt: 'How do you know Dipak?' },
  { id: 'initials', prompt: 'What are your initials?' },
  { id: 'context', prompt: 'Where did you meet him?' },
  { id: 'personality', prompt: 'What kind of person is he around you?' }
]

const Playground = ({ currentPage, onNavigate }) => {
  const containerRef = useRef(null)
  const [sessionId, setSessionId] = useState(null)
  const [conversationMode, setConversationMode] = useState('choice')
  const [channel, setChannel] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(0)
  const [result, setResult] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [isChatSending, setIsChatSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasAutoTransitioned, setHasAutoTransitioned] = useState(false)
  const recognitionRef = useRef(null)
  const scrollDeltaRef = useRef(0)
  const decayTimeoutRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let lastTouchY = null

    const resetProgress = () => {
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
      scrollDeltaRef.current = 0
      setTransitionProgress(0)
    }

    const handleAdvance = (deltaY) => {
      if (hasAutoTransitioned) return
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 15
      if (!isAtBottom || deltaY <= 0) {
        if (deltaY < 0) resetProgress()
        return
      }
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
      scrollDeltaRef.current += deltaY
      const progress = Math.min((scrollDeltaRef.current / 900) * 100, 100)
      setTransitionProgress(progress)
      if (progress >= 100) {
        setHasAutoTransitioned(true)
        setTimeout(() => onNavigate?.('contact'), 150)
      } else {
        decayTimeoutRef.current = setTimeout(resetProgress, 300)
      }
    }

    const handleWheel = (event) => handleAdvance(event.deltaY)
    const handleTouchStart = (event) => { lastTouchY = event.touches[0]?.clientY ?? null }
    const handleTouchMove = (event) => {
      const nextTouchY = event.touches[0]?.clientY
      if (lastTouchY === null || nextTouchY === undefined) return
      handleAdvance(lastTouchY - nextTouchY)
      lastTouchY = nextTouchY
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current)
    }
  }, [hasAutoTransitioned, onNavigate])

  const startDiscovery = async () => {
    setIsStarting(true)
    setResult(null)
    setQuestionNumber(0)
    setConversationMode('discovery')
    try {
      const response = await fetch(`${API_URL}/api/identity/start`, { method: 'POST' })
      if (!response.ok) throw new Error('Identity service unavailable')
      const data = await response.json()
      setSessionId(data.sessionId)
      setQuestion(data.question)
    } catch {
      setSessionId('local-demo')
      setQuestion(fallbackQuestions[0])
    } finally {
      setIsStarting(false)
    }
  }

  const chooseChannel = (nextChannel) => {
    setChannel(nextChannel)
    setConversationMode('choice')
    setResult(null)
    setQuestion(null)
    setChatMessages([])
  }

  const startUnknownChat = () => {
    setConversationMode('chat')
    setChatMessages([{ role: 'ai', content: 'You do not know me yet? Fair enough. I am Dipak. What brings you here?' }])
  }

  const startMatchedChat = () => {
    setConversationMode('chat')
    setChatMessages([{ role: 'ai', content: result?.status === 'matched' ? 'Okay, I have a better idea of who you are now. What do you want to talk about?' : 'I am still figuring out our connection, but we can talk. What is on your mind?' }])
  }

  const sendChatMessage = async (event, voiceMessage = null) => {
    event.preventDefault()
    const message = voiceMessage || chatInput.trim()
    if (!message || isChatSending) return

    const nextMessages = [...chatMessages, { role: 'user', content: message }]
    setChatMessages(nextMessages)
    setChatInput('')
    setIsChatSending(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userId: sessionId || 'playground-visitor',
          relationshipType: result?.relationshipType || 'stranger',
          history: nextMessages.map(item => ({ isBot: item.role === 'ai', text: item.content }))
        })
      })
      if (!response.ok) throw new Error('Chat service unavailable')
      const data = await response.json()
      setChatMessages(current => [...current, { role: 'ai', content: data.reply }])
      if (channel === 'voice' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.reply))
      }
    } catch {
      setChatMessages(current => [...current, { role: 'ai', content: 'I am still getting the conversation layer ready. Try me again once the backend is connected.' }])
    } finally {
      setIsChatSending(false)
    }
  }

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setChatMessages(current => [...current, { role: 'ai', content: 'Voice input is not supported in this browser. You can still use text chat.' }])
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setChatInput(transcript)
      setIsListening(false)
      if (channel === 'voice') sendChatMessage({ preventDefault: () => {} }, transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const submitAnswer = async (event) => {
    event.preventDefault()
    if (!answer.trim() || !question) return

    setIsSubmitting(true)
    const currentAnswer = answer.trim()
    setAnswer('')

    try {
      const response = await fetch(`${API_URL}/api/identity/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, questionId: question.id, answer: currentAnswer })
      })
      if (!response.ok) throw new Error('Identity service unavailable')
      const data = await response.json()
      if (data.nextQuestion) {
        setQuestion(data.nextQuestion)
        setQuestionNumber((number) => number + 1)
      } else {
        setQuestion(null)
        setResult(data)
        setConversationMode('result')
      }
    } catch {
      const nextNumber = questionNumber + 1
      if (nextNumber < fallbackQuestions.length) {
        setQuestion(fallbackQuestions[nextNumber])
        setQuestionNumber(nextNumber)
      } else {
        setQuestion(null)
        setResult({
          status: 'unknown',
          confidence: 0,
          result: 'I need a little more context before I can identify your connection.'
        })
        setConversationMode('result')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-y-auto scrollbar-hidden bg-[#C6BEB5] text-[#1A1814] font-sans select-none">
      <header className="sticky top-0 inset-x-0 h-[76px] sm:h-[104px] pt-4 sm:pt-8 pb-6 px-4 sm:px-16 grid grid-cols-2 gap-y-3 sm:flex sm:justify-between items-start z-50 bg-transparent relative">
        <div className="flex gap-4 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate?.('info')} className="text-lg sm:text-3xl text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">About</button>
          <button onClick={() => onNavigate?.('work')} className="text-lg sm:text-3xl text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Work</button>
        </div>
        <div className="fixed left-[46%] -translate-x-1/2 top-3 sm:left-1/2 sm:top-9 z-[60]">
          <button
            onClick={() => onNavigate?.('home')}
            className="text-[10px] whitespace-nowrap tracking-[0.12em] text-[#1A1814]/50 hover:text-[#1A1814] transition-colors uppercase focus:outline-none cursor-pointer"
          >
            HOME
          </button>
        </div>
        <div className="col-start-2 justify-self-end flex gap-3 sm:gap-10 md:gap-24">
          <button onClick={() => onNavigate?.('playground')} className={`text-lg sm:text-3xl leading-none font-medium ${currentPage === 'playground' ? 'text-[#0755AA] underline underline-offset-8 decoration-2' : 'text-[#1A1814]'}`}>Explore</button>
          <button onClick={() => onNavigate?.('contact')} className="text-lg sm:text-3xl text-[#1A1814] hover:text-[#0755AA] transition-colors leading-none font-medium">Contact</button>
        </div>
      </header>

      <main className="px-5 sm:px-16 md:px-24 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 sm:gap-16 lg:gap-28 items-center">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.9] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Meet my<br /><span className="italic text-[#0755AA]">digital self.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base sm:text-xl text-[#1A1814]/70 leading-relaxed">
              Ask me something, catch up,<br className="hidden sm:block" /> or just see what happens.
            </p>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}>
            {conversationMode === 'choice' && (
              <div>
                {!channel ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-normal leading-tight mb-8">Choose your way in.</h2>
                    <div className="border-t border-[#1A1814]/20">
                      <button onClick={() => chooseChannel('text')} className="group w-full py-6 flex items-center justify-between text-left border-b border-[#1A1814]/20 hover:text-[#0755AA] transition-colors">
                        <span className="flex items-baseline gap-5"><span className="font-mono text-[10px] text-[#0755AA]">01</span><span className="text-xl sm:text-2xl">Text Chat</span></span>
                        <span className="text-sm text-[#1A1814]/50 group-hover:text-[#0755AA]">Type with Dipak&nbsp; ↗</span>
                      </button>
                      <button onClick={() => chooseChannel('voice')} className="group w-full py-6 flex items-center justify-between text-left border-b border-[#1A1814]/20 hover:text-[#0755AA] transition-colors">
                        <span className="flex items-baseline gap-5"><span className="font-mono text-[10px] text-[#0755AA]">02</span><span className="text-xl sm:text-2xl">Voice</span></span>
                        <span className="text-sm text-[#1A1814]/50 group-hover:text-[#0755AA]">Talk with Dipak&nbsp; ◌</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#0755AA] uppercase mb-5">{channel === 'voice' ? 'Voice agent' : 'Text chatbot'}</p>
                    <h2 className="text-3xl sm:text-4xl font-normal leading-tight">Do you know Dipak?</h2>
                    <p className="mt-4 text-sm sm:text-base text-[#1A1814]/65 leading-relaxed">Choose a relationship path, then {channel === 'voice' ? 'speak' : 'chat'} with the clone.</p>
                    <div className="mt-8 grid sm:grid-cols-2 gap-3">
                      <button onClick={startDiscovery} disabled={isStarting} className="bg-[#1A1814] text-[#E8E5DE] px-5 py-4 text-sm text-left hover:bg-[#0755AA] transition-colors disabled:opacity-50">{isStarting ? 'Starting...' : 'I know Dipak'}</button>
                      <button onClick={startUnknownChat} className="border border-[#1A1814]/30 px-5 py-4 text-sm text-left hover:border-[#0755AA] transition-colors">I don’t know him</button>
                    </div>
                    <button onClick={() => chooseChannel(null)} className="mt-6 text-xs text-[#1A1814]/50 hover:text-[#0755AA]">Choose another mode</button>
                  </>
                )}
              </div>
            )}

            {conversationMode === 'discovery' && question && (
              <form onSubmit={submitAnswer}>
                <div className="flex justify-between items-center mb-8">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#0755AA] uppercase">Question {questionNumber + 1} / 4</p>
                  <span className="text-xs text-[#1A1814]/45">Identity discovery</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-normal leading-tight">{question.prompt}</h2>
                <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} autoFocus rows={4} className="mt-8 w-full resize-none bg-transparent border-b border-[#1A1814]/30 py-3 text-base sm:text-lg focus:outline-none focus:border-[#0755AA]" placeholder="Write naturally..." />
                <button type="submit" disabled={isSubmitting || !answer.trim()} className="mt-8 bg-[#1A1814] text-[#E8E5DE] px-6 py-3 text-sm hover:bg-[#0755AA] transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Thinking...' : 'Continue'}
                </button>
              </form>
            )}

            {conversationMode === 'result' && result && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#0755AA] uppercase mb-5">First read</p>
                <h2 className="text-3xl sm:text-4xl font-normal leading-tight">{result.result}</h2>
                <p className="mt-5 text-sm text-[#1A1814]/60">Confidence: {result.confidence || 0}%</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={startMatchedChat} className="bg-[#1A1814] text-[#E8E5DE] px-5 py-3 text-sm hover:bg-[#0755AA] transition-colors">Talk to Dipak</button>
                  <button onClick={() => { setQuestion(null); setResult(null); setSessionId(null); setConversationMode('choice') }} className="border border-[#1A1814]/30 px-5 py-3 text-sm hover:border-[#0755AA] transition-colors">Start over</button>
                  <button onClick={() => onNavigate?.('contact')} className="bg-[#1A1814] text-[#E8E5DE] px-5 py-3 text-sm hover:bg-[#0755AA] transition-colors">Leave a message</button>
                </div>
              </div>
            )}

            {conversationMode === 'chat' && channel === 'text' && (
              <div className="flex flex-col min-h-[420px] border-t border-[#1A1814]/20">
                <div className="flex-1 space-y-4 overflow-y-auto">
                  <div className="py-5 flex justify-between items-baseline border-b border-[#1A1814]/15">
                    <p className="text-2xl sm:text-3xl">Text Chat</p>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-[#0755AA] uppercase">01 / 02</span>
                  </div>
                  {chatMessages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`max-w-[90%] p-4 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-[#1A1814] text-[#E8E5DE]' : 'border-l-2 border-[#0755AA] text-[#1A1814]/75'}`}>
                      {message.content}
                    </div>
                  ))}
                </div>
                <form onSubmit={sendChatMessage} className="mt-8 flex gap-2 border-t border-[#1A1814]/15 pt-4">
                  <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={isListening ? 'Listening...' : 'Say something...'} className="min-w-0 flex-1 bg-transparent border-b border-[#1A1814]/30 py-3 text-sm focus:outline-none focus:border-[#0755AA]" />
                  <button type="submit" disabled={isChatSending || !chatInput.trim()} className="bg-[#1A1814] text-[#E8E5DE] px-4 text-sm disabled:opacity-40">{isChatSending ? '...' : 'Send'}</button>
                </form>
              </div>
            )}

            {conversationMode === 'chat' && channel === 'voice' && (
              <div className="flex flex-col min-h-[420px] border-t border-[#1A1814]/20">
                <div className="py-5 flex justify-between items-baseline border-b border-[#1A1814]/15">
                  <p className="text-2xl sm:text-3xl">Voice Agent</p>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#0755AA] uppercase">02 / 02</span>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {chatMessages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[90%] p-4 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-[#1A1814] text-[#E8E5DE]' : 'border-l-2 border-[#0755AA] text-[#1A1814]/75'}`}>{message.content}</div>)}
                </div>
                <button type="button" onClick={toggleListening} className={`group mx-auto mt-8 w-24 h-24 rounded-full border flex items-center justify-center text-sm transition-all ${isListening ? 'border-[#0755AA] text-[#0755AA] shadow-[0_0_0_12px_rgba(7,85,170,0.12)]' : 'border-[#1A1814] text-[#1A1814] hover:border-[#0755AA] hover:text-[#0755AA]'}`}>
                  <span className="text-2xl">{isListening ? 'Ⅱ' : '◉'}</span>
                </button>
                <p className="mt-4 text-center text-xs text-[#1A1814]/50">{isListening ? 'Listening for you...' : 'Tap to speak with Dipak'}</p>
              </div>
            )}
          </motion.section>
        </div>
      </main>
      <PageEnd nextPage="contact" nextLabel="Contact" onNavigate={onNavigate} progress={transitionProgress} />
    </div>
  )
}

export default Playground
