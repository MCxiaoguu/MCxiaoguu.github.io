import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'

interface LayoutProps {
  isDark: boolean
  toggleTheme: () => void
}

const Layout: React.FC<LayoutProps> = ({ isDark, toggleTheme }) => {
  return (
    <>
      <Navigation isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </>
  )
}

export default Layout
