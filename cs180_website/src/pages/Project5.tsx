import React, { useState } from 'react'
import { BaseProject, ProjectSidebar } from '../components/BaseProject'
import { getImageUrl, projectsData } from '../data/projects'
import ImageModal from '../components/ImageModal'

interface Project5Props {
  isDark: boolean
  toggleTheme: () => void
}

const FALLBACK_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='

const Project5: React.FC<Project5Props> = ({ isDark, toggleTheme }) => {
  const project = projectsData['6']
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)

  if (!project) {
    return null
  }

  const renderTextBlock = (text?: string) => {
    if (!text?.trim()) return null
    return (
      <p className="text-[#666] dark:text-[#999] leading-relaxed whitespace-pre-line text-left">
        {text}
      </p>
    )
  }

  const formatIdentifier = (value: string) => value.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()

  const capitalizeSentence = (value: string) => {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const translateLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('#')) {
      return capitalizeSentence(trimmed.replace(/^#\s*/, ''))
    }
    if (trimmed.startsWith('def ')) {
      const signature = trimmed.replace(/^def\s+/, '').replace(/:/, '')
      const name = signature.split('(')[0]
      const args = signature.substring(signature.indexOf('(') + 1, signature.lastIndexOf(')'))
      const argText = args ? ` with arguments ${formatIdentifier(args)}` : ''
      return `Define ${formatIdentifier(name)}${argText}.`
    }
    if (/^for\s+/.test(trimmed)) {
      return `${capitalizeSentence(trimmed.replace(':', ''))}.`
    }
    if (/^while\s+/.test(trimmed)) {
      return `${capitalizeSentence(trimmed.replace(':', ''))}.`
    }
    if (/^if\s+/.test(trimmed)) {
      return `${capitalizeSentence(trimmed.replace(':', ''))}.`
    }
    if (/^elif\s+/.test(trimmed)) {
      return `${capitalizeSentence(trimmed.replace('elif', 'Else if').replace(':', ''))}.`
    }
    if (trimmed === 'else:' || trimmed === 'else') {
      return 'Otherwise, continue.'
    }
    if (/^with\s+/.test(trimmed)) {
      return `${capitalizeSentence(trimmed.replace(':', ''))}.`
    }
    if (trimmed.startsWith('return ')) {
      return `Return ${trimmed.replace('return', '').trim()}.`
    }
    if (trimmed.includes(' = ') && !trimmed.includes('==')) {
      const [lhs, rhs] = trimmed.split('=')
      return `Set ${formatIdentifier(lhs)} to ${formatIdentifier(rhs)}.`
    }
    const callMatch = trimmed.match(/^([a-zA-Z_][\w\.]*)\((.*)\)$/)
    if (callMatch) {
      const fn = formatIdentifier(callMatch[1])
      const args = callMatch[2].trim()
      const argText = args ? ` with ${formatIdentifier(args)}` : ' with no arguments'
      return `Call ${fn}${argText}.`
    }
    return capitalizeSentence(formatIdentifier(trimmed)) + '.'
  }

  const renderCodeSnippets = (snippets?: any[]) => {
    if (!snippets || snippets.length === 0) return null
    return (
      <div className="space-y-4 mt-4 text-left">
        {snippets.map((snippet, idx) => (
          <div
            key={idx}
            className="bg-[#f7f4ef] dark:bg-blue-900/20 p-4"
          >
            {(snippet.description || snippet.filename) && (
              <div className="text-sm font-semibold text-[#444] dark:text-[#e0e0e0] mb-2">
                {snippet.description || snippet.filename}
              </div>
            )}
            <div className="space-y-2 text-sm leading-6 text-[#333] dark:text-[#d0d0d0]">
              {snippet.code
                .split('\n')
                .map((line: string, lineIdx: number) => {
                  const content = translateLine(line)
                  if (!content) return null
                  const indent = Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2)
                  return (
                    <div key={lineIdx} className="flex" style={{ marginLeft: indent * 12 }}>
                      <span className="text-[#7a4dff] dark:text-[#c4b5fd] mr-2">▹</span>
                      <span className="flex-1">{content}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderImages = (images?: string[], captions?: string[], singleColumn: boolean = false) => {
    if (!images || images.length === 0) return null
    return (
      <div className="flex justify-center mt-6 w-full">
        <div
          className={`grid gap-6 place-items-center w-full mx-auto ${singleColumn ? 'grid-cols-1 max-w-[60%]' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[80%]'}`}
        >
          {images.map((imageName, index) => {
            const caption = captions?.[index] || ''
            const src = imageName ? getImageUrl(project.folder, imageName) : FALLBACK_IMG
            return (
              <div key={`${imageName}-${index}`} className="flex flex-col space-y-3 w-full">
                <div
                  className="overflow-hidden cursor-pointer flex items-center justify-center min-h-[220px] w-full"
                  onClick={() => setModalImage({ src, alt: caption || 'Project output' })}
                >
                  <img
                    src={src}
                    alt={caption || 'Project output'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.src = FALLBACK_IMG
                    }}
                  />
                </div>
                <p className="text-sm text-center text-[#666] dark:text-[#9e9e9e] leading-relaxed">
                  {caption}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSubSection = (subSection: any, index: number, singleColumn: boolean = false) => {
    return (
      <div key={`${subSection.name}-${index}`} className="p-6 space-y-4">
        {subSection.name && (
          <h3 className="text-2xl font-semibold text-[#222] dark:text-[#f1f1f1] text-left">
            {subSection.name}
          </h3>
        )}
        {renderTextBlock(subSection.description)}
        {renderCodeSnippets(subSection.code)}
        {renderImages(subSection.images, subSection.captions, singleColumn)}

        {subSection.subSections && subSection.subSections.length > 0 && (
          <div className="space-y-6">
            {subSection.subSections.map((child: any, childIndex: number) => (
              <div key={`${child.name}-${childIndex}`} className="border-l-4 border-[#c1c5ff] dark:border-[#6d7bff] pl-4">
                {child.name && (
                  <h4 className="text-xl font-semibold text-[#333] dark:text-[#e5e5e5] mb-2">
                    {child.name}
                  </h4>
                )}
                {renderTextBlock(child.description)}
                {renderCodeSnippets(child.code)}
                {renderImages(child.images, child.captions, singleColumn)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <BaseProject
        isDark={isDark}
        toggleTheme={toggleTheme}
        title={`${project.title}${project.title_des ? ' - ' + project.title_des : ''}`}
      >
        <div className="min-h-screen flex items-center justify-center mb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-[#222] dark:text-[#e5e5e5] mb-6">
              {project.title_des || project.title}
            </h1>
            <p className="text-2xl text-[#666] dark:text-[#999] mb-8 leading-relaxed">
              {project.description}
            </p>
            <div className="mx-auto flex w-48 overflow-hidden">
              <span className="h-1 flex-1 bg-[#7a4dff]" />
              <span className="h-1 flex-1 bg-[#9b83ff]" />
              <span className="h-1 flex-1 bg-[#c4b5fd]" />
              <span className="h-1 flex-1 bg-[#dcd6ff]" />
              <span className="h-1 flex-1 bg-[#8d8bff]" />
              <span className="h-1 flex-1 bg-[#b4a1ff]" />
            </div>
          </div>
        </div>

        <div className="space-y-24">
          {project.imageSets.map((set, index) => {
            const isPartB = set.name.toLowerCase().startsWith('part b')
            return (
              <section key={`${set.name}-${index}`} className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1a1] dark:text-[#7d7d7d] mb-2">
                    {`Module ${index + 1}`}
                  </p>
                  <h2 className="text-4xl font-bold text-[#1d1d1d] dark:text-white mb-4">
                    {set.name}
                  </h2>
                  <div className="max-w-3xl mx-auto space-y-4">
                    {renderTextBlock(set.description)}
                    {renderImages(set.images, set.captions, isPartB)}
                  </div>
                </div>

                <div className="space-y-12">
                  {set.subSections?.map((subSection: any, subIndex: number) =>
                    renderSubSection(subSection, subIndex, isPartB)
                  )}
                </div>
              </section>
            )
          })}
        </div>

        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-bold text-[#222] dark:text-[#e5e5e5]">About This Project</h2>
              <div className="space-y-4 text-lg text-[#666] dark:text-[#999] leading-relaxed">
                {project.longDescription.split('\n').map((paragraph, idx) =>
                  paragraph.trim() ? <p key={`long-${idx}`}>{paragraph.trim()}</p> : null
                )}
              </div>
            </div>
            <ProjectSidebar technologies={project.technologies} features={project.features} />
          </div>
        </div>
      </BaseProject>

      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}
    </>
  )
}

export default Project5
