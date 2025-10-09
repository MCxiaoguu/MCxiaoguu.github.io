import React, { useEffect, useRef, useState } from 'react'
import { BaseProject, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import ImageModal from '../components/ImageModal'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface Project3Props {
  isDark: boolean
  toggleTheme: () => void
}

const Project3: React.FC<Project3Props> = ({ isDark, toggleTheme }) => {
  const project = projectsData['4']

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

  // Helper to render LaTeX
  const renderFormula = (formula: string, isBlock: boolean = false) => {
    try {
      return isBlock ? <BlockMath>{formula}</BlockMath> : <InlineMath>{formula}</InlineMath>
    } catch (error) {
      return <span className="text-red-500">Formula rendering error</span>
    }
  }

  const processSteps = project.imageSets

  // Process LaTeX and markdown text
  const processLatex = (text: string) => {
    const blockParts = text.split('$$')
    const elements: JSX.Element[] = []

    blockParts.forEach((part, blockIndex) => {
      if (blockIndex % 2 === 1) {
        elements.push(
          <div key={`block-${blockIndex}`} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-center my-6">
            {renderFormula(part, true)}
          </div>
        )
      } else {
        if (part.trim()) {
          const inlineParts = part.split('$')
          const inlineElements: (string | JSX.Element)[] = []

          inlineParts.forEach((inlinePart, inlineIndex) => {
            if (inlineIndex % 2 === 1) {
              inlineElements.push(
                <span key={`inline-${inlineIndex}`} className="inline-block">
                  {renderFormula(inlinePart, false)}
                </span>
              )
            } else {
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
                typeof element === 'string' ? (
                  <span key={idx} dangerouslySetInnerHTML={{ __html: element }} />
                ) : (
                  element
                )
              )}
            </div>
          )
        }
      }
    })

    return elements
  }

  // SubSection component (for A.1, A.2, A.3, A.4)
  const SubSection: React.FC<{
    subSection: any
    subIndex: number
  }> = ({ subSection, subIndex }) => {
    const hasImages = (subSection.images || []).length > 0
    return (
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-[#222] dark:text-[#e5e5e5]">
          {subSection.name}
        </h4>
        {subSection.description && (
          <p className="text-[#666] dark:text-[#999] leading-relaxed">{subSection.description}</p>
        )}
        {hasImages ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-stretch">
            {subSection.images.map((imageName: string, imgIndex: number) => {
              const imageSrc = getImageUrl(project.folder, imageName)
              return (
                <div key={`${subIndex}-${imgIndex}`} className="flex flex-col space-y-2">
                  <div
                    className="flex-1 flex items-center justify-center overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-white dark:bg-gray-800"
                    onClick={() => setModalImage({ src: imageSrc, alt: subSection.captions[imgIndex] })}
                  >
                    <img
                      src={imageSrc}
                      alt={subSection.captions[imgIndex]}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
                      }}
                    />
                  </div>
                  <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                    {subSection.captions[imgIndex]}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center">
            <div className="text-5xl mb-2">🖼️</div>
            <p className="text-[#666] dark:text-[#999]">Images will be added soon.</p>
          </div>
        )}
      </div>
    )
  }

  // Step section component
  const StepSection: React.FC<{
    step: any
    index: number
    isActive: boolean
  }> = ({ step, index, isActive }) => {
    const hasSubSections = step.subSections && step.subSections.length > 0

    return (
      <div
        ref={(el) => (stepRefs.current[index] = el)}
        className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="text-center mb-12">
            <div className="text-sm font-medium text-[#656464] dark:text-[#656464] mb-2">STEP {index + 1}</div>
            <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-4">{step.name}</h2>
          </div>

          {hasSubSections ? (
            <div className="space-y-12">
              {step.description && <div className="space-y-4">{processLatex(step.description)}</div>}
              {step.subSections.map((subSection: any, subIndex: number) => (
                <SubSection key={subIndex} subSection={subSection} subIndex={subIndex} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className={`transform transition-all duration-1000 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-70'
              }`}>
                <div className="space-y-6">{processLatex(step.description)}</div>
              </div>
              <div className={`transform transition-all duration-1000 delay-300 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-70'
              }`}>
                {(step.images || []).length > 0 ? (
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
                          <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">{step.captions[imgIndex]}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-[#666] dark:text-[#999] text-lg">Results coming soon...</p>
                    <p className="text-[#999] dark:text-[#666] text-sm mt-2">Images will be added as the project progresses</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <BaseProject
      isDark={isDark}
      toggleTheme={toggleTheme}
      title={project.title + (project.title_des ? ' - ' + project.title_des : ' - ' + project.description)}
    >
      {/* Hero Section (match Project 2 style) */}
      <div className="min-h-screen flex items-center justify-center mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">{project.title_des}</h1>
          <p className="text-2xl text-[#666] dark:text-[#999] mb-8 leading-relaxed">
            {project.description}
          </p>
          <div className="mx-auto flex w-48 overflow-hidden rounded-full">
            <span className="h-1 flex-1 bg-[#7a4d2a]"></span>
            <span className="h-1 flex-1 bg-[#b06f3a]"></span>
            <span className="h-1 flex-1 bg-[#d49d6a]"></span>
            <span className="h-1 flex-1 bg-[#f0d3a6]"></span>
            <span className="h-1 flex-1 bg-[#8e5b33]"></span>
            <span className="h-1 flex-1 bg-[#c38755]"></span>
          </div>
        </div>
      </div>

      {/* Step Sections */}
      <div className="space-y-24">
        {processSteps.map((step: any, index: number) => (
          <StepSection key={index} step={step} index={index} isActive={index <= currentStep} />)
        )}
      </div>

      {/* Project Details Grid */}
      <div className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">About This Project</h2>
            <div className="prose prose-lg max-w-none text-[#666] dark:text-[#999]">
              {project.longDescription && (
                <p className="leading-relaxed mb-6">{project.longDescription}</p>
              )}
              <div className="mt-8 p-6 bg-[#f8f6f0] dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-bold text-[#222] dark:text-[#e5e5e5] mb-3">Highlights</h4>
                <ul className="space-y-2 text-[#666] dark:text-[#999]">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-[#7a4d2a] mr-2">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <ProjectSidebar technologies={project.technologies} features={project.features} />
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

export default Project3
