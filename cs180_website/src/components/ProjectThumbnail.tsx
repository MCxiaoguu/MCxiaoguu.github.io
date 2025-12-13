import React, { useState, useEffect } from 'react'
import { ProjectData, getImageUrl, getProjectThumbnail } from '../data/projects'

interface ProjectThumbnailProps {
  project: ProjectData
  className?: string
  alt?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ 
  project, 
  className, 
  alt, 
  onError 
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setIsLoading(true)
        setError(false)
        const src = await getProjectThumbnail(project)
        setThumbnailSrc(src)
      } catch (err) {
        console.error('Failed to generate thumbnail:', err)
        setError(true)
        // Fallback to single image
        setThumbnailSrc(getImageUrl(project.folder, project.image))
      } finally {
        setIsLoading(false)
      }
    }

    generateThumbnail()
  }, [project])

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <div className="text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </div>
    )
  }

  return (
    <img
      src={thumbnailSrc}
      alt={alt || `${project.title} preview`}
      className={className}
      onError={(e) => {
        if (!error) {
          setError(true)
          // Final fallback
          const target = e.target as HTMLImageElement
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPnt7UFJPSKBDVF9OQU1FfX08L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaWNrIHRvIHZpZXcgZGV0YWlsczwvdGV4dD48L3N2Zz4='.replace('{{PROJECT_NAME}}', project.title)
        }
        if (onError) {
          onError(e)
        }
      }}
    />
  )
}

export default ProjectThumbnail
