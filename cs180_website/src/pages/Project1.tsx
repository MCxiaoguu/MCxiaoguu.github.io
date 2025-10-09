import React, { useState, useEffect, useRef } from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import MermaidChart from '../components/MermaidChart'
import MermaidDiagram from '../components/MermaidDiagram'
import ImageModal from '../components/ImageModal'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface Project1Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project1: React.FC<Project1Props> = ({ isDark, toggleTheme }) => {
  // TODO: Update the project id and data for Project 1
  const project = projectsData['2']
  
  // Modal state for image popup
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)
  
  // Step tracking for scroll-based animations
  const [currentStep, setCurrentStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll listener for step progression
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const elementTop = rect.top + scrollY
          const elementCenter = elementTop + rect.height / 2
          
          if (scrollY + windowHeight / 2 >= elementCenter && index > currentStep) {
            setCurrentStep(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentStep])

  // Helper function to render LaTeX formulas
  const renderFormula = (formula: string, isBlock: boolean = false) => {
    try {
      return isBlock ? <BlockMath>{formula}</BlockMath> : <InlineMath>{formula}</InlineMath>
    } catch (error) {
      return <span className="text-red-500">Formula rendering error</span>
    }
  }

  // Process steps (first 4 image sets)
  const processSteps = project.imageSets.slice(0, 4)

  // Step section component
  const StepSection: React.FC<{
    step: any;
    index: number;
    isActive: boolean;
  }> = ({ step, index, isActive }) => {
    
    // Custom layout for Step 1 (Image Slicing)
    if (index === 0) {
      return (
        <div 
          ref={(el) => stepRefs.current[index] = el}
          className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-sm font-medium text-[#656464] dark:text-[#656464] mb-2">
                STEP {index + 1}
              </div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                {step.name.replace('Step ' + (index + 1) + ': ', '')}
              </h2>
              <p className="text-lg text-[#666] dark:text-[#999] leading-relaxed max-w-3xl mx-auto">
                {step.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Original Image */}
              <div className={`transform transition-all duration-1000 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
              }`}>
                <div className="text-center">
                  <div 
                    className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    style={{ height: '360px' }}
                    onClick={() => setModalImage({ 
                      src: getImageUrl(project.folder, step.images[0]), 
                      alt: step.captions[0] 
                    })}
                  >
                    <img
                      src={getImageUrl(project.folder, step.images[0])}
                      alt={step.captions[0]}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-[#656464] dark:text-[#656464] mt-3 font-medium">
                    {step.captions[0]}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center lg:justify-center items-center" style={{ height: '360px' }}>
                <div className="text-[#333333] dark:text-[#333333]">
                  {/* Arrow Right for desktop, Arrow Down for mobile */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden lg:block w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="lg:hidden w-12 h-12 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                  </svg>
                </div>
              </div>

              {/* Sliced Channels */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
              }`}>
                <div className="grid grid-cols-1 gap-4" style={{ height: '360px' }}>
                  {step.images.slice(1).map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const captionIndex = imgIndex + 1
                    return (
                      <div key={imgIndex} className="flex items-center gap-4" style={{ height: '112px' }}>
                        <div 
                          className="w-28 h-28 overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
                          onClick={() => setModalImage({ src: imageSrc, alt: step.captions[captionIndex] })}
                        >
                          <img
                            src={imageSrc}
                            alt={step.captions[captionIndex]}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#333333] dark:text-[#333333]">
                            {step.captions[captionIndex]}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Custom layout for Step 2 (Kernel Application)
    if (index === 1) {
      return (
        <div 
          ref={(el) => stepRefs.current[index] = el}
          className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-sm font-medium text-[#656464] dark:text-[#656464] mb-2">
                STEP {index + 1}
              </div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                {step.name.replace('Step ' + (index + 1) + ': ', '')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Formula and Description */}
              <div className={`transform transition-all duration-1000 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
              }`}>
                <div className="space-y-6">
                  {step.description.split('\n\n').map((paragraph: string, pIndex: number) => {
                    // Process mixed inline and block LaTeX
                    const processLatex = (text: string) => {
                      // First, handle block formulas ($$...$$)
                      const blockParts = text.split('$$')
                      const elements: JSX.Element[] = []
                      
                      blockParts.forEach((part, blockIndex) => {
                        if (blockIndex % 2 === 1) {
                          // This is a block formula
                          elements.push(
                            <div key={`block-${blockIndex}`} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-center">
                              {renderFormula(part, true)}
                            </div>
                          )
                        } else {
                          // This is regular text, but may contain inline formulas
                          if (part.trim()) {
                            const inlineParts = part.split('$')
                            const inlineElements: (string | JSX.Element)[] = []
                            
                            inlineParts.forEach((inlinePart, inlineIndex) => {
                              if (inlineIndex % 2 === 1) {
                                // This is an inline formula
                                inlineElements.push(
                                  <span key={`inline-${inlineIndex}`} className="inline-block">
                                    {renderFormula(inlinePart, false)}
                                  </span>
                                )
                              } else {
                                // Regular text
                                if (inlinePart) {
                                  inlineElements.push(inlinePart)
                                }
                              }
                            })
                            
                            elements.push(
                              <p key={`text-${blockIndex}`} className="text-[#666] dark:text-[#999] leading-relaxed">
                                {inlineElements.map((element, idx) => 
                                  typeof element === 'string' ? element : element
                                )}
                              </p>
                            )
                          }
                        }
                      })
                      
                      return elements
                    }

                    return (
                      <div key={pIndex} className="space-y-4">
                        {processLatex(paragraph)}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Before/After Images */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
              }`}>
                <div className="grid grid-cols-1 gap-8">
                  {step.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    return (
                      <div key={imgIndex} className="space-y-3">
                        <div 
                          className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                          onClick={() => setModalImage({ src: imageSrc, alt: step.captions[imgIndex] })}
                        >
                          <img
                            src={imageSrc}
                            alt={step.captions[imgIndex]}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {step.captions[imgIndex]}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Custom layout for Step 3 & 4 (Comparisons)
    if (index === 2 || index === 3) {
      return (
        <div 
          ref={(el) => stepRefs.current[index] = el}
          className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-sm font-medium text-[#656464] dark:text-[#656464] mb-2">
                STEP {index + 1}
              </div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                {step.name.replace('Step ' + (index + 1) + ': ', '')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Description */}
              <div className={`transform transition-all duration-1000 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
              }`}>
                <div className="space-y-4">
                  {step.description.split('\n\n').map((paragraph: string, pIndex: number) => {
                    // Process mixed inline and block LaTeX
                    const processLatex = (text: string) => {
                      // First, handle block formulas ($$...$$)
                      const blockParts = text.split('$$')
                      const elements: JSX.Element[] = []
                      
                      blockParts.forEach((part, blockIndex) => {
                        if (blockIndex % 2 === 1) {
                          // This is a block formula
                          elements.push(
                            <div key={`block-${blockIndex}`} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-center my-4">
                              {renderFormula(part, true)}
                            </div>
                          )
                        } else {
                          // This is regular text, but may contain inline formulas
                          if (part.trim()) {
                            const inlineParts = part.split('$')
                            const inlineElements: (string | JSX.Element)[] = []
                            
                            inlineParts.forEach((inlinePart, inlineIndex) => {
                              if (inlineIndex % 2 === 1) {
                                // This is an inline formula
                                inlineElements.push(
                                  <span key={`inline-${inlineIndex}`} className="inline-block">
                                    {renderFormula(inlinePart, false)}
                                  </span>
                                )
                              } else {
                                // Regular text
                                if (inlinePart) {
                                  inlineElements.push(inlinePart.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))
                                }
                              }
                            })
                            
                            elements.push(
                              <p key={`text-${blockIndex}`} className="text-[#666] dark:text-[#999] leading-relaxed mb-4">
                                {inlineElements.map((element, idx) => 
                                  typeof element === 'string' ? 
                                    <span key={idx} dangerouslySetInnerHTML={{ __html: element }} /> : 
                                    element
                                )}
                              </p>
                            )
                          }
                        }
                      })
                      
                      return elements
                    }

                    return (
                      <div key={pIndex} className="space-y-4">
                        {processLatex(paragraph)}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Comparison Images */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
              }`}>
                <div className="space-y-8">
                  {step.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    return (
                      <div key={imgIndex} className="relative">
                        <div 
                          className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                          onClick={() => setModalImage({ src: imageSrc, alt: step.captions[imgIndex] })}
                        >
                          <img
                            src={imageSrc}
                            alt={step.captions[imgIndex]}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          {imgIndex === 0 ? 'Before' : 'After'}
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed mt-3">
                          {step.captions[imgIndex]}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default layout for other steps
    return (
      <div 
        ref={(el) => stepRefs.current[index] = el}
        className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`transform transition-all duration-1000 ${
              isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
            }`}>
              <div className="text-sm font-medium text-[#656464] dark:text-[#656464] mb-2">
                STEP {index + 1}
              </div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                {step.name.replace('Step ' + (index + 1) + ': ', '')}
              </h2>
              <div className="text-lg text-[#666] dark:text-[#999] leading-relaxed space-y-4">
                {step.description.split('\n\n').map((paragraph: string, pIndex: number) => (
                  <p key={pIndex} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </div>

            {/* Images */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
            }`}>
              <div className="grid grid-cols-1 gap-6">
                {step.images.map((imageName: string, imgIndex: number) => {
                  const imageSrc = getImageUrl(project.folder, imageName)
                  return (
                    <div key={imgIndex} className="space-y-3">
                      <div 
                        className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        onClick={() => setModalImage({ src: imageSrc, alt: step.captions[imgIndex] })}
                      >
                        <img
                          src={imageSrc}
                          alt={step.captions[imgIndex]}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                          }}
                        />
                      </div>
                      <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                        {step.captions[imgIndex]}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mermaid flowchart from prj1_alg.md
  const algorithmFlowchart = `flowchart TD
    A[Image Slicing] -->|Split into B, G, R channels based on row offsets| X(Convolution)
    X --> |Use Gaussian and Sobel Kernel to avoid brightness and contrast difference from raw pixel| B(Alignment)
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
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
            Colorizing History
          </h1>
          <p className="text-2xl text-[#666] dark:text-[#999] mb-8 leading-relaxed">
            Bringing the Prokudin-Gorskii photo collection to life through advanced image alignment algorithms
          </p>
          <div className="w-24 h-1 bg-[#7a4d2a] mx-auto"></div>
        </div>
      </div>

      {/* Step-by-Step Process */}
      <div className="space-y-32">
        {processSteps.map((step, index) => (
          <StepSection
            key={index}
            step={step}
            index={index}
            isActive={currentStep >= index}
          />
        ))}
      </div>

      {/* Algorithm Overview Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
              Methodology & Implementation
            </h2>
            <p className="text-xl text-[#666] dark:text-[#999] max-w-3xl mx-auto">
              The complete algorithm workflow and technical details
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Image Alignment Approach
              </h3>
              <p className="text-[#666] dark:text-[#999] leading-relaxed mb-8">
                The core challenge was to align the three color channel images (Red, Green, Blue) to create a coherent color image. 
                To do this, I use grid search to compare the overlapping score between each pair of frames (E.g., Blue with Red, Green with Red).
                Then, I found the best vector displacement to move a frame to make the picture aligned. I primarily tried two metrics for scoring:
                naive L-2 norm, and Normalized Cross-Correlation (NCC). L-2 Norm calculates way more faster but gives less desirable result, while NCC demonstrates
                a slower computational efficiency, albeit the parallelism from Numpy and OpenCV, but way better result.
              </p>
              
              <p className="text-[#666] dark:text-[#999] leading-relaxed">
                Nevertheless, grid search for both metrics are inefficient for larger images, such as those .tif files from the glass plate scan.
                Therefore, I adopt a <a 
                  href="https://en.wikipedia.org/wiki/Pyramid_(image_processing)" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-[#222] dark:text-[#e5e5e5] mx-1"
                >pyramid-based alignment algorithm</a> that works efficiently on large images. In short, it begins by scaling the image to the coarsest scale.
                Then, it starts to find the best displacement vector. Thanks to the smaller image size, finding it is much faster. Then, this vector is recorded and scaled back
                to the next level by multiplying it by 2 (which is the next scale in the pyramid). The next grid search begins with that coarse vector displacement
                and a smaller grid size (as we are dealing with larger images at next scale). Repeat this for multiple times until the image is no longer scaled. I use
                that final displacement vector as an alignment.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Algorithm Flow
              </h3>
              <p className="text-[#666] dark:text-[#999] leading-relaxed mb-6">
                The following flowchart illustrates the complete algorithm workflow for colorizing the Prokudin-Gorskii images:
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <MermaidChart chart={algorithmFlowchart} isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Algorithm Details
              </h3>
              <ul className="space-y-4 text-[#666] dark:text-[#999]">
                <li className="flex items-start">
                  <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                  <span>
                    <span className="font-bold ">Convolution:</span> Because the pixel brightness (density) and overall contrast drastically differ among
                    frames, I chose to plot the contour through convolving with two kernels. I first applied the Gaussian 3x3 kernel, followed by 
                    calculating the gradient in both x and y direction using sobel kernel (for specific matrix choice, please visit the previous parts) respectively. With this, I am able to extract the contour and therefore minimize the distraction from varying density. By introducing this improvement,
                    it helps me to tackle the last few images, including Emir, that were previously challenging to align.
                    <br className='font-bold'/>Note that I put the convolution before the image pyramid to avoid repetitive calculation, and only use it for alignment so that during final channel composition
                    only original images were used. 
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                  <span>
                    <span className="font-bold">Image Slicing:</span> Because images are provided as pure grayscale, they have the same value on each of the three channels. Therefore,
                    I arbitrarily selected the first channel and extract it. Then, I simply sliced the frames into three by the one-third of the total height - as the 
                    given images are vertically stacked together.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                  <span>
                    <span className="font-bold">Image Pyramid:</span> For large images, I used a scale of 16x to original scale to fasten the grid search.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                  <span>
                    <span className="font-bold">Image Scaling:</span> I used 16x as a beginning, as it would reduce even the 3000x3000~ tif image to around 300x300. Even for 2000s computer 
                    they can still efficiently handle grid search at a usable speed. 
                    For implementations, I called the most fundamental <a 
                      href="https://opencv.org/blog/resizing-and-rescaling-images-with-opencv/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline text-[#222] dark:text-[#e5e5e5] mx-1"
                    >cv.resize from OpenCV</a> for image resizing, as per requirement says. 
                    By default (which is what I used) it uses the average method to downsampling the image.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#222] dark:text-[#e5e5e5] mr-2">•</span>
                  <span>
                    <span className="font-bold">Dynamic Grid Searching:</span> Because I scaled the image to different sizes each time, I dynamically reduce the grid search radius for 
                    computation efficiency. At the scale of 16, I begin with a radius of 30, then I gradually reduce it to 10 to ensure that the 
                    search is efficient as I am dealing with larger image (less scaling)
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-[#f8f6f0] dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-bold text-[#222] dark:text-[#e5e5e5] mb-3">Performance Notes</h4>
              <p className="text-[#666] dark:text-[#999] leading-relaxed">
                The pyramid approach reduces computational complexity from O(n²) to O(n log n) for large images, 
                while maintaining high alignment accuracy. Before applying the image pyramid, for a large tif image of 3000x3000~ size,
                using NCC metrics would take around two minutes. Now it only takes less than 10 seconds.
                To be noticed, Some images like "Emir" required special handling due to 
                clothing color variations that affected standard correlation metrics.
                <br /><br />However, as it can be seen that there are some images still not perfectly aligned. It might be due to the radius of the Grid search: the optimal
                displacement sometimes lies outside the radius! Nevertheless, for most of the images, the alignments are fairly effective!
                <br /><br />Another thing worth noticing here is that sometimes at the coarser level of the image pyramid, a vector containing 0 may be calculated. After scaling up,
                this would remain the same and therefore might be out of Grid radius for certain circumstances. Solutions might include adding a small residual part to prevent the fixation of 
                0 after scaling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Gallery */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
              Colorized Results
            </h2>
            <p className="text-xl text-[#666] dark:text-[#999] max-w-3xl mx-auto mb-8">
              14 historical images from the{' '}
              <a 
                href="https://www.loc.gov/collections/prokudin-gorskii/?st=grid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline text-[#7a4d2a] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Prokudin-Gorskii collection
              </a>
              {' '}brought to life through algorithmic colorization
            </p>
          </div>

          {/* Main Gallery */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-[#222] dark:text-[#e5e5e5] mb-8">
              {project.imageSets[4].name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {project.imageSets[4].captions.map((caption, index) => {
                const imageName = project.imageSets[4].images[index];
                const imageSrc = getImageUrl(project.folder, imageName);
                return (
                  <div key={caption} className="group">
                    <div 
                      className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      onClick={() => setModalImage({ src: imageSrc, alt: `${caption} colorized image` })}
                    >
                      <img
                        src={imageSrc}
                        alt={`${caption} colorized image`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-[#222] dark:text-[#e5e5e5] mb-1">
                        {caption.split(' - ')[0]}
                      </p>
                      <p className="text-xs text-[#666] dark:text-[#999]">
                        {caption.split(' - ')[1]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Self-Selected Images */}
          <div>
            <h3 className="text-2xl font-semibold text-[#222] dark:text-[#e5e5e5] mb-4">
              {project.imageSets[5].name}
            </h3>
            <p className="text-[#666] dark:text-[#999] mb-8">
              {project.imageSets[5].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.imageSets[5].captions.map((caption, index) => {
                const imageName = project.imageSets[5].images[index];
                const imageSrc = getImageUrl(project.folder, imageName);
                return (
                  <div key={caption} className="group">
                    <div 
                      className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      onClick={() => setModalImage({ src: imageSrc, alt: `${caption} colorized image` })}
                    >
                      <img
                        src={imageSrc}
                        alt={`${caption} colorized image`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-[#222] dark:text-[#e5e5e5] mb-1">
                        {caption.split(' - ')[0]}
                      </p>
                      <p className="text-xs text-[#666] dark:text-[#999]">
                        {caption.split(' - ')[1]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                About This Project
              </h2>
              <div className="prose prose-lg max-w-none text-[#666] dark:text-[#999]">
                <p className="leading-relaxed mb-6">
                  {project.longDescription}
                </p>
                
                <div className="bg-[#f8f6f0] dark:bg-blue-900/20 rounded-xl p-6 mt-8">
                  <h4 className="font-semibold text-[#222] dark:text-[#e5e5e5] mb-3">Key Achievements</h4>
                  <ul className="space-y-2 text-[#666] dark:text-[#999]">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

                      <span> Successfully aligned and colorized 14+ historical images</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

                      <span> Implemented image pyramid for 99.5% performance improvement</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

                      <span> Robust alignment using gradient-based features</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

                      <span> Handled challenging cases with varying illumination</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <ProjectSidebar 
              technologies={project.technologies}
              features={project.features}
            />
          </div>
        </div>
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
