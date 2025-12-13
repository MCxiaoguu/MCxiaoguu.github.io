import React from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'

interface ProjectTemplateProps {
  isDark: boolean
  toggleTheme: () => void
  projectId: string
}

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ isDark, toggleTheme, projectId }) => {
  const project = projectsData[projectId]

  if (!project) {
    return (
      <BaseProject isDark={isDark} toggleTheme={toggleTheme} title="Project Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-4">
            Project Not Found
          </h2>
          <p className="text-[#666] dark:text-[#999] mb-6">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </BaseProject>
    )
  }

  return (
    <BaseProject 
      isDark={isDark} 
      toggleTheme={toggleTheme} 
      title={project.title}
    >
      {/* Project Introduction */}
      <div className="mb-12">
        <p className="text-xl text-[#666] dark:text-[#999] mb-6">
          {project.description}
        </p>
        
        {/* Demo/GitHub links */}
        <div className="flex gap-4">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#222] dark:bg-[#e5e5e5] text-white dark:text-[#222] rounded-lg hover:bg-[#333] dark:hover:bg-[#d0d0d0] transition-colors"
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[#222] dark:border-[#e5e5e5] text-[#222] dark:text-[#e5e5e5] rounded-lg hover:bg-[#222] hover:text-white dark:hover:bg-[#e5e5e5] dark:hover:text-[#222] transition-colors"
          >
            View Code
          </a>
        </div>
      </div>

      {/* Project Images */}
      <ProjectImageGrid 
        images={project.images}
        folder={project.folder}
        title={project.title}
        getImageUrl={getImageUrl}
      />

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Description */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-4">
            About This Project
          </h2>
          <p className="text-[#666] dark:text-[#999] leading-relaxed whitespace-pre-line">
            {project.longDescription}
          </p>
        </div>

        {/* Sidebar */}
        <ProjectSidebar 
          technologies={project.technologies}
          features={project.features}
        />
      </div>
    </BaseProject>
  )
}

export default ProjectTemplate
