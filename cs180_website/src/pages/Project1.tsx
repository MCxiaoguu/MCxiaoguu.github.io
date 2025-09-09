import React from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import MermaidChart from '../components/MermaidChart'
import MermaidDiagram from '../components/MermaidDiagram'

interface Project1Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project1: React.FC<Project1Props> = ({ isDark, toggleTheme }) => {
  // TODO: Update the project id and data for Project 1
  const project = projectsData['2']

  // Mermaid flowchart from prj1_alg.md
  const algorithmFlowchart = `flowchart TD
    A[Image Slicing] -->|Split into B, G, R channels based on row offsets| B(Alignment)
    B --> |Image is Large| D[Build Image Pyramid]
    B --> |Image is Small| Z[Compose RGB Image]

    %% Image Pyramid Loop
    D --> |Downscale to Next Level| F[Grid Search / Score Matching]
    F --> |Compute Best Displacement Vector at This Scale| G[Store Displacement & Scale Up]
    %% Exit Condition
    D --> |Reached Finest Scale| H[Apply Final Displacement]
    H --> Z[Compose RGB Image]`

  return (
    <BaseProject 
      isDark={isDark} 
      toggleTheme={toggleTheme} 
      title={project.title + (project.title_des ? " - " + project.title_des : " - " + project.description)}
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

      {/* Section 1 - Update with Project 1 content */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          {project.imageSets[0].name}
        </h2>
        <p className="text-[#666] dark:text-[#999] mb-8 leading-relaxed">
          {project.imageSets[0].description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {project.imageSets[0].captions.map((caption, index) => {
                    const imageName = project.imageSets[0].images[index];
                    return (
                      <div key={caption} className="flex flex-col">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(project.folder, imageName)}
                            alt={`${caption} colorized image`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                            }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-sm font-medium text-[#222] dark:text-[#e5e5e5]">
                            {caption}
                          </span>
                        </div>
                      </div>
                    );
            })}
        </div>
      </div>

      {/* Section 2 - Update with Project 1 content */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          {project.imageSets[1].name}
        </h2>
        <p className="text-[#666] dark:text-[#999] mb-8 leading-relaxed">
          {project.imageSets[1].description}
        </p>
        <div className="grid grid-cols-1 gap-4">
            {project.imageSets[1].captions.map((caption, index) => {
                    const imageName = project.imageSets[1].images[index];
                    return (
                      <div key={caption} className="flex flex-col">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden max-w-md mx-auto">
                          <img
                            src={getImageUrl(project.folder, imageName)}
                            alt={`${caption} colorized image`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                            }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-sm font-medium text-[#222] dark:text-[#e5e5e5]">
                            {caption}
                          </span>
                        </div>
                      </div>
                    );
            })}
        </div>
      </div>

      {/* Methodology Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-medium text-[#222] dark:text-[#e5e5e5] mb-6">
          Methodology & Implementation
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
              Image Alignment Approach
            </h3>
            <p className="text-[#666] dark:text-[#999] leading-relaxed">
              The core challenge was to align the three color channel images (Red, Green, Blue) to create a coherent color image. 
              I implemented a pyramid-based alignment algorithm that works efficiently on both small and large images.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
              Algorithm Flow
            </h3>
            <p className="text-[#666] dark:text-[#999] leading-relaxed mb-4">
              The following flowchart illustrates the complete algorithm workflow for colorizing the Prokudin-Gorskii images:
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <MermaidChart chart={algorithmFlowchart} isDark={isDark} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
              Algorithm Details
            </h3>
            <ul className="space-y-2 text-[#666] dark:text-[#999]">
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Image Pyramid:</strong> For large images, I used a multi-scale approach to speed up the alignment process</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Similarity Metrics:</strong> Implemented normalized cross-correlation and structural similarity measures</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Search Strategy:</strong> Exhaustive search within a reasonable displacement range for optimal alignment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Edge Cropping:</strong> Automatic removal of border artifacts to improve alignment accuracy</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
              Technical Implementation
            </h3>
            <p className="text-[#666] dark:text-[#999] leading-relaxed">
              The implementation leverages NumPy for efficient array operations and OpenCV for advanced image processing capabilities. 
              The algorithm automatically detects the best alignment parameters for each image pair, handling various lighting conditions 
              and image qualities present in the historical Prokudin-Gorskii collection.
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-[#222] dark:text-[#e5e5e5] mb-2">Performance Notes</h4>
            <p className="text-sm text-[#666] dark:text-[#999]">
              The pyramid approach reduces computational complexity from O(n²) to O(n log n) for large images, 
              while maintaining high alignment accuracy. Some images like "Emir" required special handling due to 
              clothing color variations that affected standard correlation metrics.
            </p>
          </div>
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

          {/* Custom content for Project 1 */}
          <div className="mt-8">
            {/* TODO: Add acknowledgements or extra info */}
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

export default Project1
