import React, { useState } from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import MermaidChart from '../components/MermaidChart'
import MermaidDiagram from '../components/MermaidDiagram'
import ImageModal from '../components/ImageModal'

interface Project1Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project1: React.FC<Project1Props> = ({ isDark, toggleTheme }) => {
  // TODO: Update the project id and data for Project 1
  const project = projectsData['2']
  
  // Modal state for image popup
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)

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
          Below are the all 14 composed Images based on the algorithmn I developed from the{' '}
          <a 
            href="https://www.loc.gov/collections/prokudin-gorskii/?st=grid" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Prokudin-Gorskii photo collection
          </a>. Note that for some images the performance is great, yet for some there are spaces to improve.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {project.imageSets[0].captions.map((caption, index) => {
                    const imageName = project.imageSets[0].images[index];
                    const imageSrc = getImageUrl(project.folder, imageName);
                    return (
                      <div key={caption} className="flex flex-col">
                        <div 
                          className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => setModalImage({ src: imageSrc, alt: `${caption} colorized image` })}
                        >
                          <img
                            src={imageSrc}
                            alt={`${caption} colorized image`}
                            className="w-full h-full object-contain"
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
          These are the images I selected from{' '}
          <a 
            href="https://www.loc.gov/collections/prokudin-gorskii/?st=grid" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Prokudin-Gorskii collection
          </a>. The composing algorithmn also works decent on them!
        </p>
        <div className="grid grid-cols-1 gap-4">
            {project.imageSets[1].captions.map((caption, index) => {
                    const imageName = project.imageSets[1].images[index];
                    const imageSrc = getImageUrl(project.folder, imageName);
                    return (
                      <div key={caption} className="flex flex-col">
                        <div 
                          className="aspect-[4/3] rounded-lg overflow-hidden max-w-md mx-auto cursor-pointer"
                          onClick={() => setModalImage({ src: imageSrc, alt: `${caption} colorized image` })}
                        >
                          <img
                            src={imageSrc}
                            alt={`${caption} colorized image`}
                            className="w-full h-full object-contain"
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
              To do this, I use grid search to compare the overlapping score between each pair of frames (E.g., Blue with Red, Green with Red).
              Then, I found the best vector displacement to move a frame to make the picture aligned. I primarily tried two metrics for scoring:
              naive L-2 norm, and Normalized Cross-Correlation (NCC). L-2 Norm calculates way more faster but gives less desirable result, while NCC demonstrates
              a slower computational efficiency, albeit the parallelism from Numpy and OpenCV, but way better result. The comparison for the same image aligning of a 
              picture can be seen below.
            </p>
            
            {/* L-2 vs NCC Comparison */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.imageSets[2].captions.map((caption, index) => {
                const imageName = project.imageSets[2].images[index];
                const imageSrc = getImageUrl(project.folder, imageName);
                return (
                  <div key={caption} className="flex flex-col">
                    <div 
                      className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setModalImage({ src: imageSrc, alt: `${caption} comparison` })}
                    >
                      <img
                        src={imageSrc}
                        alt={`${caption} comparison`}
                        className="w-full h-full object-contain"
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
            
            <p className="text-[#666] dark:text-[#999] leading-relaxed mt-4">
              <br />Nevertheless, grid search for both metrics are inefficient for larger images, such as those .tif files from the glass plate scan.
              Therefore, I adopt a <a 
                href="https://en.wikipedia.org/wiki/Pyramid_(image_processing)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >pyramid-based alignment algorithm</a> that works efficiently on large images. In short, it begins by scaling the image to the coarest scale.
              Then, it starts to find the best displacement vector. Thanks to the smaller image size, finding it is much faster. Then, this vector is recorded and scaled back
              to the next level by multiplying it by 2 (which is the next scale in the pyramid). The next grid search begins with that coarse vector displacement
              and a smaller grid size (as we are dealing with larger images at next scale). Repeat this for multiple times until the image is no longer scaled. I use
              that final displacement vector as an alignment. For details on scaling factor, grid search radius, scaling options, please check the technical details
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
                <span><strong>Image Pyramid:
                    </strong> For large images, I used a scale of 16x to original scale to fasten the grid search.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Image Scaling:
                    </strong> I used 16x as a begining, as it would reduce even the 3000x3000~ tif image to around 300x300. Even for 2000s computer 
                    they can still efficiently handle grid search at a usable speed. 
                    For implementations, I called the most fundamental <a 
                      href="https://opencv.org/blog/resizing-and-rescaling-images-with-opencv/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >cv.resize from OpenCV</a> for image resizing, as per requirement says. 
                    By default (which is what I used) it uses the average method to downsampling the image.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                <span><strong>Dynamic Grid Searching:
                    </strong> Because I scaled the image to different sizes each time, I dynamically reduce the grid search radius for 
                    computation efficieny. At the scale of 16, I begin with a radius of 30, then I gradually reduce it to 10 to ensure that the 
                    search is efficient as I am dealing with larger image (less scaling)</span>
              </li>
            </ul>
          </div>

          {/* <div>
            <h3 className="text-lg font-medium text-[#222] dark:text-[#e5e5e5] mb-3">
              Technical Implementation
            </h3>
            <p className="text-[#666] dark:text-[#999] leading-relaxed">
              The implementation leverages NumPy for efficient array operations and OpenCV for advanced image processing capabilities. 
              The algorithm automatically detects the best alignment parameters for each image pair, handling various lighting conditions 
              and image qualities present in the historical Prokudin-Gorskii collection.
            </p>
          </div> */}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-[#222] dark:text-[#e5e5e5] mb-2">Performance Notes</h4>
            <p className="text-sm text-[#666] dark:text-[#999]">
              The pyramid approach reduces computational complexity from O(n²) to O(n log n) for large images, 
              while maintaining high alignment accuracy. Before applying the image pyramid, for a large tif image of 3000x3000~ size,
              using NCC metrics would take around two minutes. Now it only takes less than 10 seconds.
              To be noticed, Some images like "Emir" required special handling due to 
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
      
      {/* Image Modal */}
      <ImageModal
        isOpen={modalImage !== null}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.alt || ''}
        onClose={() => setModalImage(null)}
      />
    </BaseProject>
  )
}

export default Project1
