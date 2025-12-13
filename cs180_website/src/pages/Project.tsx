import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectsData } from '../data/projects'
import Navigation from '../components/Navigation'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import Project0 from './Project0'
import Project1 from './Project1'
import Project2 from './Project2'
import ProjectTemplate from '../components/ProjectTemplate'
import Project3 from './Project3'
import Project4 from './Project4'
import Project5 from './Project5'

interface ProjectProps {
  isDark: boolean
  toggleTheme: () => void
}

const Project: React.FC<ProjectProps> = ({ isDark, toggleTheme }) => {
  const { projectId } = useParams<{ projectId: string }>()
  
  if (!projectId || !projectsData[projectId]) {
    return (
      <>
        {/* Custom Header for Project Pages */}
        <header className="border-b border-gray-300 dark:border-gray-600 mx-4 md:mx-12 lg:mx-[100px] my-[10px]">
          <div className="flex items-center gap-4 m-2.5">
            <Link
              to="/"
              className="text-[#666] dark:text-[#999] hover:text-[#222] dark:hover:text-[#e5e5e5] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h1 className="text-4xl font-thin text-[#222] dark:text-[#e5e5e5]">
              Project Not Found
            </h1>
          </div>
        </header>

        <Navigation isDark={isDark} toggleTheme={toggleTheme} />

        <main>
          <PageTransition>
            <div className="mx-4 md:mx-12 lg:mx-[100px] my-10">
              <div className="text-center">
                <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-4">
                  Project Not Found
                </h2>
                <p className="text-[#666] dark:text-[#999] mb-6">
                  The project you're looking for doesn't exist.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-[#222] dark:bg-[#e5e5e5] text-white dark:text-[#222] rounded-lg hover:bg-[#333] dark:hover:bg-[#d0d0d0] transition-colors"
                >
                  Back to Projects
                </Link>
              </div>
            </div>
          </PageTransition>
        </main>

        <Footer />
      </>
    )
  }

  // Route to specific project pages
  switch (projectId) {
    case '1':
      return <Project0 isDark={isDark} toggleTheme={toggleTheme} />
    // Add more specific project pages here as they're created
    case '2':
       return <Project1 isDark={isDark} toggleTheme={toggleTheme} />
    case '3':
      return <Project2 isDark={isDark} toggleTheme={toggleTheme} />
    case '4':
      return <Project3 isDark={isDark} toggleTheme={toggleTheme} />
    case '5':
      return <Project4 isDark={isDark} toggleTheme={toggleTheme} />
    case '6':
      return <Project5 isDark={isDark} toggleTheme={toggleTheme} />
    default:
      // Fallback to template for projects without custom pages
      return <ProjectTemplate isDark={isDark} toggleTheme={toggleTheme} projectId={projectId} />
  }
}

export default Project
