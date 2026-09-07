import React, { useState } from 'react'
import Home from './components/Home'
import Info from './components/Info'
import Work from './components/Work'
import Contact from './components/Contact'
import Workflow from './components/Workflow'
import Playground from './components/Playground'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#C6BEB5]">
      {currentPage === 'home'    && <Home    currentPage={currentPage} onNavigate={handleNavigate} />}
      {currentPage === 'info'    && <Info    currentPage={currentPage} onNavigate={handleNavigate} />}
      {currentPage === 'work'    && <Work    currentPage={currentPage} onNavigate={handleNavigate} />}
      {currentPage === 'contact'  && <Contact  currentPage={currentPage} onNavigate={handleNavigate} />}
      {currentPage === 'workflow' && <Workflow currentPage={currentPage} onNavigate={handleNavigate} />}
      {currentPage === 'playground' && <Playground currentPage={currentPage} onNavigate={handleNavigate} />}

    </div>
  )
}

export default App
