import React, { useState, useEffect, useRef } from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import MermaidChart from '../components/MermaidChart'
import MermaidDiagram from '../components/MermaidDiagram'
import ImageModal from '../components/ImageModal'
import CodeBlock from '../components/CodeBlock'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface Project2Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project2: React.FC<Project2Props> = ({ isDark, toggleTheme }) => {
  const project = projectsData['3']
  
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

  // Process steps (all 10 steps for Project 2)
  const processSteps = project.imageSets

  // Step section component
  const StepSection: React.FC<{
    step: any;
    index: number;
    isActive: boolean;
  }> = ({ step, index, isActive }) => {
    
    // Process LaTeX and markdown text
    const processLatex = (text: string) => {
      // First, handle block formulas ($$...$$)
      const blockParts = text.split('$$')
      const elements: JSX.Element[] = []
      
      blockParts.forEach((part, blockIndex) => {
        if (blockIndex % 2 === 1) {
          // This is a block formula
          elements.push(
            <div key={`block-${blockIndex}`} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-center my-6">
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
                // Regular text - process markdown
                if (inlinePart) {
                  inlineElements.push(
                    inlinePart
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  )
                }
              }
            })
            
            elements.push(
              <div key={`text-${blockIndex}`} className="text-[#666] dark:text-[#999] leading-relaxed mb-4 space-y-4">
                {inlineElements.map((element, idx) => 
                  typeof element === 'string' ? 
                    <span key={idx} dangerouslySetInnerHTML={{ __html: element }} /> : 
                    element
                )}
              </div>
            )
          }
        }
      })
      
      return elements
    }

    // SubSection component for handling sub-parts
    const SubSection: React.FC<{
      subSection: any;
      subIndex: number;
    }> = ({ subSection, subIndex }) => {
      // Determine grid layout based on number of images
      const getGridLayout = (imageCount: number) => {
        if (imageCount === 0) return ""
        if (imageCount === 1) return "grid-cols-1"
        if (imageCount === 2) return "grid-cols-1 md:grid-cols-2"
        if (imageCount === 3) return "grid-cols-1 md:grid-cols-3"
        if (imageCount === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        if (imageCount === 5) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4" // default for many images
      }

      return (
        <div className="mb-16 last:mb-0">
          <h4 className="text-2xl font-semibold text-[#7a4d2a] dark:text-[#7a4d2a] mb-4">
            {subSection.name}
          </h4>
          <p className="text-[#666] dark:text-[#999] leading-relaxed mb-8 text-lg">
            {subSection.description}
          </p>

          {/* Code Section */}
          {subSection.code && subSection.code.length > 0 && (
            <div className="mb-8">
              <h5 className="text-lg font-semibold text-[#7a4d2a] dark:text-[#7a4d2a] mb-4">
                Implementation Code
              </h5>
              <CodeBlock 
                snippets={subSection.code} 
                layout={subSection.code.length === 2 ? 'side-by-side' : 'tabs'}
              />
            </div>
          )}

          {subSection.images.length > 0 ? (
            <div className={`grid ${getGridLayout(subSection.images.length)} gap-6`}>
              {subSection.images.map((imageName: string, imgIndex: number) => {
                const imageSrc = getImageUrl(project.folder, imageName)
                return (
                  <div key={imgIndex} className="space-y-3">
                    <div 
                      className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800"
                      onClick={() => setModalImage({ src: imageSrc, alt: subSection.captions[imgIndex] })}
                    >
                      <img
                        src={imageSrc}
                        alt={subSection.captions[imgIndex]}
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                        }}
                      />
                    </div>
                    <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed font-medium">
                      {subSection.captions[imgIndex]}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            // Placeholder for missing images (like FFT analysis)
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-[#666] dark:text-[#999] text-lg">
                FFT Analysis Coming Soon...
              </p>
              <p className="text-[#999] dark:text-[#666] text-sm mt-2">
                Frequency domain visualizations will be added
              </p>
            </div>
          )}
        </div>
      )
    }

    // Check if this step has subsections to determine layout
    const hasSubSections = step.subSections && step.subSections.length > 0
    // Special case: "Additional Examples" section should use full-width layout
    const useFullWidthLayout = hasSubSections || step.name.includes('Additional Examples of Multi-resolution Blending')

    return (
      <div 
        ref={(el) => stepRefs.current[index] = el}
        className={`min-h-screen flex items-center justify-center transition-all duration-1000 py-24 ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
              {step.name}
            </h2>
          </div>

          {useFullWidthLayout ? (
            // Full-width layout for steps with subsections
            <div className={`transform transition-all duration-1000 ${
              isActive ? 'translate-x-0 opacity-100' : 'translate-x-0 opacity-70'
            }`}>
              {/* Main description */}
              <div className="mb-12">
                <div className="space-y-6 max-w-4xl mx-auto">
                  {step.description.split('\n\n').map((paragraph: string, pIndex: number) => {
                    // Handle bullet points
                    if (paragraph.includes('**') && paragraph.includes(':')) {
                      const bulletPoints = paragraph.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
                      const mainText = paragraph.split('\n').filter(line => !line.trim().startsWith('-') && !line.trim().startsWith('•')).join('\n')
                      
                      return (
                        <div key={pIndex} className="space-y-4">
                          {mainText && (
                            <div className="space-y-4">
                              {processLatex(mainText)}
                            </div>
                          )}
                          {bulletPoints.length > 0 && (
                            <ul className="space-y-3 mt-6">
                              {bulletPoints.map((bullet, bIndex) => (
                                <li key={bIndex} className="flex items-start text-[#666] dark:text-[#999]">
                                  <span className="text-[#7a4d2a] mr-3 mt-1">•</span>
                                  <span dangerouslySetInnerHTML={{ 
                                    __html: bullet.replace(/^[•-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                  }} />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    }
                    
                    return (
                      <div key={pIndex} className="space-y-4">
                        {processLatex(paragraph)}
                      </div>
                    )
                  })}
                  
                  {/* Code Section for steps with subsections */}
                  {step.code && step.code.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold text-[#7a4d2a] dark:text-[#7a4d2a] mb-4">
                        Implementation Code
                      </h4>
                      <CodeBlock 
                        snippets={step.code}
                        layout={step.code.length === 2 ? 'side-by-side' : 'tabs'}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Images for sections without subsections (like Additional Examples) */}
              {!hasSubSections && step.images.length > 0 && (
                <div className="mb-12">
                  {step.name.includes('Additional Examples of Multi-resolution Blending') ? (
                    // Special horizontal layout for Additional Examples - matching sharpening section style
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {step.images.map((imageName: string, imgIndex: number) => {
                        const imageSrc = getImageUrl(project.folder, imageName)
                        return (
                          <div key={imgIndex} className="space-y-3">
                            <div 
                              className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800"
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
                            <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed font-medium">
                              {step.captions[imgIndex]}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    // Regular vertical layout for other sections
                    <div className="grid gap-6 grid-cols-1">
                      {step.images.map((imageName: string, imgIndex: number) => {
                        const imageSrc = getImageUrl(project.folder, imageName)
                        return (
                          <div key={imgIndex} className="space-y-3">
                            <div 
                              className="rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800"
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
                            <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed font-medium">
                              {step.captions[imgIndex]}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SubSections */}
              <div className="space-y-16">
                {step.subSections && step.subSections.map((subSection: any, subIndex: number) => (
                  <SubSection key={subIndex} subSection={subSection} subIndex={subIndex} />
                ))}
              </div>
            </div>
          ) : (
            // Split layout for regular steps
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Text Content */}
              <div className={`transform transition-all duration-1000 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
              }`}>
                <div className="space-y-6">
                  {step.description.split('\n\n').map((paragraph: string, pIndex: number) => {
                    // Handle bullet points
                    if (paragraph.includes('**') && paragraph.includes(':')) {
                      const bulletPoints = paragraph.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
                      const mainText = paragraph.split('\n').filter(line => !line.trim().startsWith('-') && !line.trim().startsWith('•')).join('\n')
                      
                      return (
                        <div key={pIndex} className="space-y-4">
                          {mainText && (
                            <div className="space-y-4">
                              {processLatex(mainText)}
                            </div>
                          )}
                          {bulletPoints.length > 0 && (
                            <ul className="space-y-3 mt-6">
                              {bulletPoints.map((bullet, bIndex) => (
                                <li key={bIndex} className="flex items-start text-[#666] dark:text-[#999]">
                                  <span className="text-[#7a4d2a] mr-3 mt-1">•</span>
                                  <span dangerouslySetInnerHTML={{ 
                                    __html: bullet.replace(/^[•-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                  }} />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    }
                    
                    return (
                      <div key={pIndex} className="space-y-4">
                        {processLatex(paragraph)}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Images */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
              }`}>
                {step.images.length > 0 ? (
                  // Render regular images with special handling for specific sections
                  <div className={`${
                    step.name.includes('Additional Examples of Multi-resolution Blending') 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
                      : 'grid gap-6 grid-cols-1'
                  }`}>
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
                ) : (
                  // Render placeholder
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-[#666] dark:text-[#999] text-lg">
                      Results coming soon...
                    </p>
                    <p className="text-[#999] dark:text-[#666] text-sm mt-2">
                      Images will be added as the project progresses
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Code Section - Full Width (outside of conditional layouts) */}
          {step.code && step.code.length > 0 && (
            <div className="mt-12 w-full">
              <h4 className="text-xl font-semibold text-[#7a4d2a] dark:text-[#7a4d2a] mb-6 text-center">
                Implementation Code
              </h4>
              <CodeBlock 
                snippets={step.code}
                layout={step.code.length === 2 ? 'side-by-side' : 'tabs'}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Algorithm flowchart for frequency domain processing
  const algorithmFlowchart = `flowchart TD
    A[Input Image] --> B[Convolution Implementation]
    B --> C[Finite Difference Operators]
    C --> D[Gradient Computation]
    D --> E[Gaussian Smoothing]
    E --> F[DoG Filters]
    F --> G[Edge Detection]
    
    A --> H[Frequency Analysis]
    H --> I[Low-Pass Filtering]
    H --> J[High-Pass Filtering]
    I --> K[Hybrid Image Creation]
    J --> K
    
    A --> L[Gaussian Stack]
    L --> M[Laplacian Stack]
    M --> N[Multi-resolution Blending]
    
    G --> O[Gradient Orientations]
    K --> P[Color Enhancement]
    N --> Q[Creative Blending]`

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
            Filters & Frequencies
          </h1>
          <p className="text-2xl text-[#666] dark:text-[#999] mb-8 leading-relaxed">
            Exploring the mathematical foundations of image processing through convolution, frequency domain analysis, and multi-resolution techniques
          </p>
          <div className="w-24 h-1 bg-[#7a4d2a] mx-auto"></div>
        </div>
      </div>

      {/* Step-by-Step Process */}
      <div className="space-y-0">
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
              Algorithm Workflow
            </h2>
            <p className="text-xl text-[#666] dark:text-[#999] max-w-3xl mx-auto">
              Complete pipeline from basic convolution to advanced multi-resolution blending
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Frequency Domain Processing Pipeline
              </h3>
              <p className="text-[#666] dark:text-[#999] leading-relaxed mb-8">
                This project implements a comprehensive image processing pipeline that spans from fundamental convolution operations 
                to sophisticated frequency domain manipulations. The workflow demonstrates how different spatial frequencies can be 
                isolated, modified, and recombined to achieve various visual effects.
              </p>
              
              <p className="text-[#666] dark:text-[#999] leading-relaxed">
                Key innovations include implementing convolution from scratch using numpy, developing robust edge detection through 
                derivative of Gaussian filters, creating perceptually-driven hybrid images, and achieving seamless image blending 
                through multi-resolution Laplacian stacks. Each technique builds upon the previous, creating a comprehensive 
                understanding of how images can be analyzed and manipulated in the frequency domain.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Processing Flow
              </h3>
              <p className="text-[#666] dark:text-[#999] leading-relaxed mb-6">
                The following flowchart illustrates the complete processing pipeline from basic filtering to advanced blending techniques:
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <MermaidChart chart={algorithmFlowchart} isDark={isDark} />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
                Technical Implementation
              </h3>
              <ul className="space-y-4 text-[#666] dark:text-[#999]">
                <li className="flex items-start">
                  <span className="text-[#7a4d2a] mr-2">•</span>
                  <span>
                    <span className="font-bold">Convolution Engine:</span> Custom implementation with proper boundary handling and padding, 
                    optimized from O(n⁴) four-loop to O(n²) vectorized operations. Verified against scipy.signal.convolve2d for accuracy.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7a4d2a] mr-2">•</span>
                  <span>
                    <span className="font-bold">Edge Detection Pipeline:</span> Progressive refinement from basic finite differences to 
                    derivative of Gaussian filters, with adaptive thresholding for optimal noise/edge balance.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7a4d2a] mr-2">•</span>
                  <span>
                    <span className="font-bold">Frequency Domain Analysis:</span> 2D FFT visualization for understanding filter effects, 
                    with careful cutoff frequency selection for hybrid image creation.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7a4d2a] mr-2">•</span>
                  <span>
                    <span className="font-bold">Multi-resolution Framework:</span> Gaussian and Laplacian stack construction with perfect 
                    reconstruction property, enabling seamless blending at multiple frequency scales.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7a4d2a] mr-2">•</span>
                  <span>
                    <span className="font-bold">Perceptual Enhancements:</span> HSV color space visualization for gradient orientations, 
                    color-aware hybrid images, and content-sensitive mask design for artistic blending.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-[#f8f6f0] dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-bold text-[#222] dark:text-[#e5e5e5] mb-3">Mathematical Foundations</h4>
              <p className="text-[#666] dark:text-[#999] leading-relaxed">
                The project is grounded in solid mathematical theory, from the convolution theorem linking spatial and frequency domains, 
                to the multi-scale analysis enabling pyramid-based processing. Each implementation includes proper handling of edge cases, 
                numerical stability considerations, and perceptually-motivated parameter choices.
                <br /><br />
                The frequency domain analysis reveals how different spatial scales contribute to image perception, while the multi-resolution 
                approach enables natural blending that respects image structure at all scales. The combination creates a powerful toolkit 
                for both understanding and manipulating digital images.
              </p>
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
                  <h4 className="font-semibold text-[#222] dark:text-[#e5e5e5] mb-3">Learning Objectives</h4>
                  <ul className="space-y-2 text-[#666] dark:text-[#999]">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-1 mr-2 text-[#7a4d2a]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Master fundamental convolution operations and their applications</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-1 mr-2 text-[#7a4d2a]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Understand frequency domain analysis and filtering</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-1 mr-2 text-[#7a4d2a]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Explore multi-scale image representations</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-1 mr-2 text-[#7a4d2a]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>Create compelling visual effects through mathematical techniques</span>
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

export default Project2