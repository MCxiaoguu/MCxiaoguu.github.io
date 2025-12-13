// Utility to generate composite thumbnail from multiple images
export const generateCompositeThumbnail = async (
  imageUrls: string[],
  captions: string[],
  outputWidth: number = 800,
  outputHeight: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    canvas.width = outputWidth
    canvas.height = outputHeight
    
    // Set background color
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, outputWidth, outputHeight)
    
    const imageWidth = outputWidth / imageUrls.length
    const captionHeight = 30
    const imageHeight = outputHeight - captionHeight
    
    let loadedImages = 0
    const images: HTMLImageElement[] = []
    
    // Load all images
    imageUrls.forEach((url, index) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        images[index] = img
        loadedImages++
        
        if (loadedImages === imageUrls.length) {
          // Draw all images and captions in a horizontal row
          images.forEach((img, idx) => {
            const x = idx * imageWidth
            const y = 0
            
            // Draw image
            ctx.drawImage(img, x, y, imageWidth, imageHeight)
            
            // Draw caption
            ctx.fillStyle = '#333333'
            ctx.font = '14px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(
              captions[idx],
              x + imageWidth / 2,
              imageHeight + 20
            )
          })
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
          resolve(dataUrl)
        }
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`))
      }
      
      img.src = url
    })
  })
}

// Generate thumbnail for Project 0
export const generateProject1Thumbnail = async (): Promise<string> => {
  const selectedImages = ['9mm.JPG', '28mm.JPG', '135mm.JPG', '800mm.JPG']
  const captions = ['9mm', '28mm', '135mm', '800mm']
  
  const imageUrls = selectedImages.map(img => `/images/project1/${img}`)
  
  return generateCompositeThumbnail(imageUrls, captions, 800, 200)
}
