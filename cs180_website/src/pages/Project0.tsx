import React from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'

interface Project0Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project0: React.FC<Project0Props> = ({ isDark, toggleTheme }) => {
  const project = projectsData['1']

  return (
    <BaseProject 
      isDark={isDark} 
      toggleTheme={toggleTheme} 
      title={project.title + " - " + project.description}
    >
      {/* Project Introduction */}
      <div className="mb-12">
        {/* Demo/GitHub*/}
        {/*   
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
        */}
      </div>

      {/* Focal Length Demonstration */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          {project.imageSets[0].description}
        </h2>
        <p className="text-[#666] dark:text-[#999] mb-8 leading-relaxed">
          The following images demonstrate how different focal lengths affect perspective and field of view when photographing the same subject from the same position.
        </p>
        
        {/* Focal Length Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-0">
          {project.imageSets[0].captions.map((focalLength, index) => {
            const imageName = project.imageSets[0].images[index];
            return (
              <div key={focalLength} className="flex flex-col">
                <div className="aspect-[4/3] rounded-none overflow-hidden">
                  <img
                    src={getImageUrl(project.folder, imageName)}
                    alt={`${focalLength} focal length demonstration`}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-[#222] dark:text-[#e5e5e5]">
                    {focalLength}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-sm text-[#666] dark:text-[#999] italic">
          The distortion under various focal length is because the perspective from different focal length produces different result for same image size. Think 
          the 800mm as an approximation of the orthographic project, so everything that suppose to be more parallel looks for parallel
          than in wider focal lengths.
        </div>
      </div>

      {/* Second Image Section - Architecture */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          {project.imageSets[1].description}
        </h2>
        <p className="text-[#666] dark:text-[#999] mb-8 leading-relaxed">
          Shot at North Beanch, San Francisco.
          This section explores how architectural elements can be compressed or distorted based on the chosen focal length, demonstrating the same perspective effects in architectural photography.
        </p>
        
        {/* Architecture Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.imageSets[1].captions.map((focalLength, index) => {
            const imageName = project.imageSets[1].images[index];
            return (
              <div key={focalLength} className="flex flex-col">
                <div className="aspect-[4/3] rounded-none overflow-hidden">
                  <img
                    src={getImageUrl(project.folder, imageName)}
                    alt={`${focalLength} architectural perspective demonstration`}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-[#222] dark:text-[#e5e5e5]">
                    {focalLength}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-sm text-[#666] dark:text-[#999] italic">
          Notice how the architectural elements compress differently at various focal lengths. 
          Wide angles (14mm-24mm) emphasize the building's height and create more dramatic perspective; the vanishing point is more obvious.
          While longer focal lengths (48mm-77mm) compress the perspective and reduce the apparent depth between architectural elements.
          Note that 48mm and 77mm doesn't look drastically different because they are both relatively "normal" focal lengths with minimal distortion.
          One part is because the building is quite far away, so the perspective difference is less pronounced.
        </div>
      </div>

      {/* Video Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          Dolly Zoom Demonstration
        </h2>
        
        {/* Video Container */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <video 
            controls 
            className="w-full h-full object-cover"
          >
            <source src={getImageUrl(project.folder, 'dolly_2.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="mt-4 text-sm text-[#666] dark:text-[#999] italic">
          Dramatically I showed some facial expression to accompany the dolly zoom as if 
          I was in a horror movie. The effect is quite disorienting and surreal, 
          making it a popular technique in filmmaking to convey emotional intensity or psychological unease.
        </div>
      </div>

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

          {/* Custom content for Project 0 */}
          <div className="mt-8">
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-none">
              <h4 className="font-medium text-[#222] dark:text-[#e5e5e5] mb-2">Acknowledgement</h4>
              <p className="text-sm text-[#666] dark:text-[#999]">
                Huge thanks to my friend <a href = "https://www.instagram.com/zhengxian_jin_star" className="font-bold">Zhengxian Jin</a>, 
                who helped me complete the first and third part of the project using his excellent photography skills.
                Without him, this project would not be possible.
            </p>
            </div>
          </div>
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

export default Project0
