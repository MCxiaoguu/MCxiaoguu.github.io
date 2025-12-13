import React from 'react'

interface ImageModalProps {
  isOpen: boolean
  imageSrc: string
  imageAlt: string
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageSrc, imageAlt, onClose }) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[80vw] max-h-[80vh] p-4">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ImageModal
