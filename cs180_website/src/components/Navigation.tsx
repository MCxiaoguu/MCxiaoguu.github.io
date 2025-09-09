import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavigationProps {
  isDark: boolean
  toggleTheme: () => void
}

const Navigation: React.FC<NavigationProps> = ({ isDark, toggleTheme }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.mobile-nav')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block h-[64px] mx-4 md:mx-12 lg:mx-[100px] my-[5px] bg-[#fcfcfc] dark:bg-[#0f0f0f] overflow-visible">
        <div className="flex justify-between items-center h-full">
          <ul className="flex">
            <li className="list-none relative">
              <a 
                href="https://hanyanggu.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="block font-thin text-[24px] text-[#222] dark:text-[#e5e5e5] py-[14px] px-[14px] no-underline hover:bg-[#f3f3f3] dark:hover:bg-[#333] bg-transparent" 
              >
                Personal Homepage
              </a>
            </li>
            <li className="list-none relative">
              <Link 
                to="/" 
                className={`block font-thin text-[24px] text-[#222] dark:text-[#e5e5e5] py-[14px] px-[14px] no-underline hover:bg-[#f3f3f3] dark:hover:bg-[#333] ${
                  isActive('/') ? 'bg-[#f3f3f3] dark:bg-[#333]' : 'bg-transparent'
                }`}
              >
                Projects
              </Link>
            </li>
          </ul>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[#f3f3f3] dark:hover:bg-[#333] text-[#222] dark:text-[#e5e5e5]"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden mx-4 my-[5px] bg-[#fcfcfc] dark:bg-[#0f0f0f]">
        <div className="flex justify-between items-center h-[64px]">
          <button
            onClick={toggleMobileMenu}
            className="mobile-nav p-2 text-[#222] dark:text-[#e5e5e5]"
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[#f3f3f3] dark:hover:bg-[#333] text-[#222] dark:text-[#e5e5e5]"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-nav absolute top-[84px] left-4 right-4 bg-[#fcfcfc] dark:bg-[#0f0f0f] border border-gray-300 dark:border-gray-600 shadow-lg z-50">
            <ul className="py-2">
              <li>
                <a 
                  href="https://hanyanggu.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-thin text-[20px] text-[#222] dark:text-[#e5e5e5] py-3 px-4 no-underline hover:bg-[#f3f3f3] dark:hover:bg-[#333] bg-transparent"
                >
                  Personal Homepage
                </a>
              </li>
              <li>
                <Link 
                  to="/" 
                  className={`block font-thin text-[20px] text-[#222] dark:text-[#e5e5e5] py-3 px-4 no-underline hover:bg-[#f3f3f3] dark:hover:bg-[#333] ${
                    isActive('/') ? 'bg-[#f3f3f3] dark:bg-[#333]' : 'bg-transparent'
                  }`}
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navigation
