import React from 'react'
import { Link } from 'react-router-dom'
import { projectsArray } from '../data/projects'
import Navigation from '../components/Navigation'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import ProjectThumbnail from '../components/ProjectThumbnail'

interface HomeProps {
  isDark: boolean
  toggleTheme: () => void
}

const Home: React.FC<HomeProps> = ({ isDark, toggleTheme }) => {
  return (
    <>
      <header className="border-b border-gray-300 dark:border-gray-600 mx-4 md:mx-12 lg:mx-[100px] my-[10px]">
        <h1 className="text-4xl font-thin text-[#222] dark:text-[#e5e5e5] m-2.5">
          Hanyang Gu's CS180 Portfolio.
        </h1>
      </header>

      <Navigation isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        <PageTransition>
          <div className="mx-4 md:mx-12 lg:mx-[100px] my-10">
      <ul className="homepage_img flex flex-col md:flex-row justify-between gap-[2px] md:gap-[50px] mb-8">
        {projectsArray.map((project) => (
          <li key={project.id} className="list-none text-center flex-1">
            <Link to={`/${project.id}`} className="block group">
              <div className="relative overflow-hidden">
                <ProjectThumbnail
                  project={project}
                  className="h-[400px] md:h-[400px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay with project info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-medium text-lg mb-2">{project.title}</h3>
                    <p className="text-sm opacity-90 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-white bg-opacity-20 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-white bg-opacity-20 text-xs rounded">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Project Title Below Thumbnail */}
              <div className="mt-4 text-left">
                <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-[#666] dark:text-[#999] leading-relaxed">
                  {project.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Description text - mimicking your homepage_img_description */}
      <div className="homepage_img_description mt-[100px] my-[10px] font-thin text-[#222] dark:text-[#e5e5e5]">
        Welcome to my 
        <a 
        href="https://cal-cs180.github.io/fa25/" 
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#222] dark:text-[#e5e5e5] mx-1"
        >
          Berkeley CS180 
        </a>
        portfolio. Here you can explore my course projects.
         {/* including 
        <Link to="/1" className="underline text-[#222] dark:text-[#e5e5e5] mx-1">web applications</Link>,
        <Link to="/2" className="underline text-[#222] dark:text-[#e5e5e5] mx-1">mobile apps</Link>, and
        <Link to="/3" className="underline text-[#222] dark:text-[#e5e5e5] mx-1">machine learning projects</Link>.*/}
        Each project showcases different topics and approaches to what I've learned to solve real-world problems.
      </div>
    </div>
        </PageTransition>
      </main>

      <Footer />
    </>
  )
}

export default Home
