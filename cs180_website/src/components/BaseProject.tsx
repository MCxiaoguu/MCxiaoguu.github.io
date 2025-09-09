import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'

interface BaseProjectProps {
  isDark: boolean
  toggleTheme: () => void
  title: string
  children: React.ReactNode
}

export const BaseProject: React.FC<BaseProjectProps> = ({ 
  isDark, 
  toggleTheme, 
  title, 
  children 
}) => {
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
            {title}
          </h1>
        </div>
      </header>

      <Navigation isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        <PageTransition>
          <div className="mx-4 md:mx-12 lg:mx-[100px] my-10">
            {children}
          </div>
        </PageTransition>
      </main>

      <Footer />
    </>
  )
}

// Common components that projects can use
interface ProjectImageGridProps {
  images: string[]
  folder: string
  title: string
  getImageUrl: (folder: string, filename: string) => string
}

export const ProjectImageGrid: React.FC<ProjectImageGridProps> = ({ 
  images, 
  folder, 
  title, 
  getImageUrl 
}) => {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(folder, image)}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProjectSidebarProps {
  technologies: string[]
  features: string[]
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ 
  technologies, 
  features 
}) => {
  return (
    <div className="space-y-8">
      {/* Technologies */}
      <div>
        <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
          Technologies Used
        </h3>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[#666] dark:text-[#999] text-sm rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-[#666] dark:text-[#999] text-sm flex items-start">
              <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
