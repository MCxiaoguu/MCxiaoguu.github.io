import React, { useEffect, useRef, useState } from 'react'
import { BaseProject, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'
import ImageModal from '../components/ImageModal'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface Project4Props {
  isDark: boolean
  toggleTheme: () => void
}

// This page mirrors Project3.tsx, but reads project id '5'
// and renders the Part 0 / Part 1 / Part 2 / Part 2.6 structure
const Project4: React.FC<Project4Props> = ({ isDark, toggleTheme }) => {
  const project = projectsData['5']
  const FALLBACK_IMG =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='

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
          <div key={`block-${blockIndex}`} className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-center my-6">
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

  // Seamless media renderer:
  // - .mp4 renders as <video loop autoPlay muted playsInline>
  // - .gif uses seamless fallback (swap-preload) or relies on native infinite loop if encoded so
  // - others render as <img>
  //
  // We keep LoopingImage for GIF behavior and wrap it with MediaItem below.
  // This way we can call <MediaItem ...> everywhere we previously used <img>.
  //
  // Seamless GIF fallback:
  // If your GIF doesn't loop infinitely by itself, we simulate continuous playback
  // by swapping between a displayed <img> and a preloaded hidden <img> with a cache-busted URL.
  // Set intervalMs to (approximately) your GIF duration to minimize any visual gap.
  const LoopingImage: React.FC<{
    src: string
    alt: string
    className?: string
    loopIfGif?: boolean
    intervalMs?: number
    onClick?: () => void
  }> = ({ src, alt, className, loopIfGif = true, intervalMs = 8000, onClick }) => {
    const [error, setError] = useState(false)
    const isGif = /\.gif(\?.*)?$/i.test(src)
    const [showMain, setShowMain] = useState(true)
    const verRef = useRef(0)
    const [mainUrl, setMainUrl] = useState(src)
    const [preUrl, setPreUrl] = useState(src)
    const timerRef = useRef<number | null>(null)

    // Initialize URLs
    useEffect(() => {
      if (!isGif || !loopIfGif) return
      verRef.current = 0
      setMainUrl(`${src}${src.includes('?') ? '&' : '?'}loop=${verRef.current}`)
      setPreUrl(`${src}${src.includes('?') ? '&' : '?'}loop=${verRef.current + 1}`)
      setShowMain(true)
    }, [src, isGif, loopIfGif])

    // Swap displayed and preloaded image every intervalMs
    useEffect(() => {
      if (!isGif || !loopIfGif) return
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = window.setInterval(() => {
        // Show the preloaded one immediately
        setShowMain((prev) => !prev)
        // Prepare the next preload URL
        verRef.current += 1
        const nextPre = `${src}${src.includes('?') ? '&' : '?'}loop=${verRef.current + 1}`
        setPreUrl(nextPre)
      }, intervalMs) as unknown as number
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current)
      }
    }, [src, isGif, loopIfGif, intervalMs])

    return (
      <>
        {!isGif || !loopIfGif ? (
          <img
            src={error ? FALLBACK_IMG : src}
            alt={alt}
            className={className}
            onClick={onClick}
            onError={() => setError(true)}
          />
        ) : (
          <>
            {/* Visible image */}
            <img
              src={error ? FALLBACK_IMG : showMain ? mainUrl : preUrl}
              alt={alt}
              className={className}
              onClick={onClick}
              onError={() => setError(true)}
            />
            {/* Offscreen preloader to ensure the next cycle is ready */}
            <img
              src={showMain ? preUrl : mainUrl}
              alt=""
              className="fixed -left-[10000px] -top-[10000px] w-px h-px opacity-0 pointer-events-none select-none"
              aria-hidden="true"
            />
          </>
        )}
      </>
    )
  }

  // Detects media type and renders <video> for mp4, otherwise falls back to LoopingImage/<img>.
  const MediaItem: React.FC<{
    src: string
    alt: string
    className?: string
  }> = ({ src, alt, className }) => {
    const isMp4 = /\.mp4(\?.*)?$/i.test(src)
    const [error, setError] = useState(false)
    if (isMp4) {
      return (
        <video
          src={error ? undefined : src}
          className={className}
          autoPlay
          preload="auto"
          loop
          muted
          playsInline
          onCanPlay={(e) => {
            const v = e.currentTarget as HTMLVideoElement
            if (v.paused) {
              v.play().catch(() => {})
            }
          }}
          controls={false}
          // Show controls if you prefer:
          // controls
          onError={() => setError(true)}
        />
      )
    }
    return <LoopingImage src={src} alt={alt} className={className} />
  }

  // SubSection component (for each sub-block inside a Part)
  const SubSection: React.FC<{
    subSection: any
    subIndex: number
    parentIndex: number
  }> = ({ subSection, subIndex, parentIndex }) => {
    return (
      <div className="mb-10">
        {subSection.name && (
          <h3 className="text-2xl font-semibold text-[#222] dark:text-[#e5e5e5] mb-4">
            {subSection.name}
          </h3>
        )}
        {subSection.description && (
          <div className="mb-4">{processLatex(subSection.description)}</div>
        )}

        {/* Hyperparameter box (shared style for code-like sections) */}
        {subSection.code && subSection.code.length > 0 && (
          <div className="space-y-4 mb-6">
            {subSection.code.map((snippet: any, i: number) => (
              <div
                key={i}
                className="bg-[#f8f6f0] dark:bg-blue-900/20 p-4 "
              >
                {(snippet.description || snippet.filename) && (
                  <div className="text-sm text-[#444] dark:text-[#ddd] font-semibold mb-2">
                    {snippet.description || snippet.filename}
                  </div>
                )}
                <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-[#444] dark:text-[#cfcfcf]">
                  {snippet.code}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Images if provided */}
        {subSection.images && subSection.images.length > 0 ? (
          (() => {
            const isTrainingProgression =
              (subSection.name || '').trim() === 'Training Progression (Provided + Own Image)'
            const isFinalSweep2x2 =
              (subSection.name || '').trim() === 'Final Results: 2x2 Sweep (L and Width)'
            const isFrustumTwoCol =
              (subSection.name || '').trim() === 'Frustum Visualization'
            const isTrainingLossSingle =
              (subSection.name || '').trim() === 'Training Loss Curve'
            const isNearFarTwoCol =
              (subSection.name || '').trim() === 'Near/Far Selection Trick'
            const isIntermediateFive =
              (subSection.name || '').trim().startsWith('Intermediate Renders')
            if (isTrainingProgression) {
              const firstRow = subSection.images.slice(0, 5)
              const secondRow = subSection.images.slice(5, 10)
              return (
                <div className="space-y-6">
                  {[firstRow, secondRow].map((row: string[], rIdx: number) => (
                    <div key={rIdx} className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {row.map((imageName: string, imgIndex: number) => {
                        const imageSrc = getImageUrl(project.folder, imageName)
                        const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                        const caption = subSection.captions?.[rIdx * 5 + imgIndex] || ''
                        return (
                          <div key={imgIndex} className="space-y-3">
                    <div
                            className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300`}
                      onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                    >
                      <MediaItem
                        src={imageSrc}
                        alt={caption}
                        className="w-full h-auto object-contain max-h-72 md:max-h-80"
                      />
                    </div>
                            <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                              {caption}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )
            }
            if (isFinalSweep2x2) {
              const items = subSection.images.slice(0, 4)
              return (
                <div className="max-w-5xl mx-auto grid gap-6 grid-cols-2 justify-items-center">
                  {items.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    const caption = subSection.captions?.[imgIndex] || ''
                    return (
                      <div key={imgIndex} className="space-y-3">
                        <div
                          className={`overflow-hidden ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={caption}
                            className="w-full h-auto object-contain max-h-[36rem]"
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {caption}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (isNearFarTwoCol) {
              return (
                <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 justify-items-center">
                  {subSection.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    const caption = subSection.captions?.[imgIndex] || ''
                    return (
                      <div key={imgIndex} className="space-y-3 w-full">
                        <div
                          className={`rounded-xl overflow-hidden ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={caption}
                            className="w-full h-auto object-contain max-h-96"
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {caption}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (isFrustumTwoCol) {
              return (
                <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 justify-items-center">
                  {subSection.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    const caption = subSection.captions?.[imgIndex] || ''
                    return (
                      <div key={imgIndex} className="space-y-3 w-full">
                        <div
                          className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={caption}
                            className="w-full h-auto object-contain max-h-[36rem]"
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {caption}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (isTrainingLossSingle) {
              return (
                <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 justify-items-center">
                  {subSection.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    const caption = subSection.captions?.[imgIndex] || ''
                    return (
                      <div key={imgIndex} className="space-y-3 w-full">
                        <div
                          className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={caption}
                            className="w-full h-auto object-contain max-h-96"
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {caption}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            if (isIntermediateFive) {
              const row = subSection.images
              return (
                <div className="max-w-6xl mx-auto grid gap-6 grid-cols-4 justify-items-center">
                  {row.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    const caption = subSection.captions?.[imgIndex] || ''
                    const isLast = imgIndex === row.length - 1
                    return (
                      <div
                        key={imgIndex}
                        className={`space-y-2 w-full ${
                          isLast ? 'col-start-2 col-span-2' : ''
                        }`}
                      >
                        <div
                          className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: caption })}
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={caption}
                            className="w-full h-auto object-contain max-h-72 md:max-h-80"
                          />
                        </div>
                        <p className="text-xs text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {caption}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            // Default grid
            return (
              <div className={`grid gap-6 ${subSection.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 justify-items-center'}`}>
                {subSection.images.map((imageName: string, imgIndex: number) => {
                  const imageSrc = getImageUrl(project.folder, imageName)
                  const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                  return (
                    <div key={imgIndex} className="space-y-3">
                      <div
                            className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300`}
                        onClick={
                          isVideo
                            ? undefined
                            : () => setModalImage({ src: imageSrc, alt: subSection.captions?.[imgIndex] || '' })
                        }
                      >
                        <MediaItem
                          src={imageSrc}
                          alt={subSection.captions?.[imgIndex] || ''}
                          className={`w-full h-auto object-contain ${subSection.images.length === 1 ? 'max-h-[27rem] md:max-h-[30rem]' : 'max-h-72 md:max-h-80'}`}
                        />
                      </div>
                      <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                        {subSection.captions?.[imgIndex] || ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            )
          })()
        ) : null}
      </div>
    )
  }

  // StepSection component (for Part 0 / Part 1 / Part 2 / Part 2.6)
  const StepSection: React.FC<{
    step: any
    index: number
    isActive: boolean
  }> = ({ step, index, isActive }) => {
    const isTwoCol = /^\\s*Part\\s*2\\b/.test(step?.name || '')
    return (
      <div
        ref={(el) => (stepRefs.current[index] = el)}
        className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {isTwoCol ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Title + Description + Subsections */}
            <div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">{step.name}</h2>
              <div className="space-y-4 text-[#666] dark:text-[#999]">
                {step.description ? processLatex(step.description) : null}
              </div>
              {step.subSections && step.subSections.length > 0 && (
                <div className="mt-8 space-y-8">
                  {step.subSections.map((subSection: any, subIndex: number) => (
                    <SubSection
                      key={subIndex}
                      subSection={subSection}
                      subIndex={subIndex}
                      parentIndex={index}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Right: Visuals next to text */}
            <div>
              {step.images && step.images.length > 0 ? (
                <div className="grid gap-6 grid-cols-1">
                  {step.images.map((imageName: string, imgIndex: number) => {
                    const imageSrc = getImageUrl(project.folder, imageName)
                    const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                    return (
                      <div key={imgIndex} className="space-y-3">
                        <div
                          className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300`}
                          onClick={
                            isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: step.captions[imgIndex] })
                          }
                        >
                          <MediaItem
                            src={imageSrc}
                            alt={step.captions[imgIndex]}
                            className={`w-full h-auto object-contain ${step.images.length === 1 ? 'max-h-[36rem]' : 'max-h-96'}`}
                          />
                        </div>
                        <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">
                          {step.captions[imgIndex]}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Title and Description (full width) */}
            <div>
              <h2 className="text-4xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">{step.name}</h2>
              <div className="space-y-4 text-[#666] dark:text-[#999]">
                {step.description ? processLatex(step.description) : null}
              </div>
            </div>
            {/* Visual Content (full width, responsive grid) */}
            {step.images && step.images.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {step.images.map((imageName: string, imgIndex: number) => {
                  const imageSrc = getImageUrl(project.folder, imageName)
                  const isVideo = /\.mp4(\?.*)?$/i.test(imageSrc)
                  return (
                    <div key={imgIndex} className="space-y-3">
                      <div
                        className={` ${isVideo ? '' : 'cursor-pointer'} transform hover:scale-105 transition-transform duration-300`}
                        onClick={isVideo ? undefined : () => setModalImage({ src: imageSrc, alt: step.captions[imgIndex] })}
                      >
                        <MediaItem
                          src={imageSrc}
                          alt={step.captions[imgIndex]}
                          className={`w-full h-auto object-contain ${step.images.length === 1 ? 'max-h-[30rem]' : 'max-h-80'}`}
                        />
                      </div>
                      <p className="text-sm text-center text-[#656464] dark:text-[#656464] leading-relaxed">{step.captions[imgIndex]}</p>
                    </div>
                  )
                })}
              </div>
            ) : null}
            {/* Sub-sections (deliverables) */}
            {step.subSections && step.subSections.length > 0 && (
              <div className="mt-2 space-y-8">
                {step.subSections.map((subSection: any, subIndex: number) => (
                  <SubSection
                    key={subIndex}
                    subSection={subSection}
                    subIndex={subIndex}
                    parentIndex={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <BaseProject
      isDark={isDark}
      toggleTheme={toggleTheme}
      title={project.title + (project.title_des ? ' - ' + project.title_des : ' - ' + project.description)}
    >
      {/* Hero Section */}
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

      {/* Part Sections */}
      <div className="space-y-24">
        {processSteps.map((step: any, index: number) => (
          <StepSection key={index} step={step} index={index} isActive={true} />
        ))}
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
              <div className="mt-8 p-6 bg-[#f8f6f0] dark:bg-blue-900/20">
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

export default Project4
