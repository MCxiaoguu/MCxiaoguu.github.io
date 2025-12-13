import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Project from './pages/Project'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0f0f0f] overflow-x-hidden">
      <Routes>
        <Route index element={<Home isDark={isDark} toggleTheme={toggleTheme} />} />
        <Route path=":projectId" element={<Project isDark={isDark} toggleTheme={toggleTheme} />} />
      </Routes>
    </div>
  )
}

export default App
