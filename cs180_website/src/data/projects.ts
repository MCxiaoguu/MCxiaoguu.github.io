import { generateProject1Thumbnail } from '../utils/thumbnailGenerator'

// Shared project data for both Home and Project components
export interface ImageSet {
  name: string
  description: string
  images: string[]
  captions: string[]
}

export interface ProjectData {
  id: string
  title: string
  title_des: string
  description: string
  longDescription: string
  folder: string
  image: string
  images: string[]
  imageSets: ImageSet[]
  technologies: string[]
  demoUrl: string
  githubUrl: string
  features: string[]
  thumbnailType?: 'single' | 'composite'
}

// Helper function to get image URL that works in both dev and production
export const getImageUrl = (folder: string, filename: string): string => {
  // In Vite, assets in public folder are served from root
  return `/images/${folder}/${filename}`
}

// Generate composite thumbnail for project
export const getProjectThumbnail = async (project: ProjectData): Promise<string> => {
  if (project.thumbnailType === 'composite' && project.id === '1') {
    try {
      return await generateProject1Thumbnail()
    } catch (error) {
      console.warn('Failed to generate composite thumbnail, falling back to single image:', error)
      return getImageUrl(project.folder, project.image)
    }
  }
  return getImageUrl(project.folder, project.image)
}

export const projectsData: Record<string, ProjectData> = {
  '1': {
    id: '1',
    title: 'Project 0',
    title_des: '',
    description: 'Becoming Friends with Your Camera',
    longDescription: `This project explores the fundamentals of photography and camera mechanics. 
    We dive deep into concepts like field of view (FOV), perspective distortion, depth of field effects, 
    and camera calibration techniques. Through practical experiments with different focal lengths and 
    camera settings, we learn how to manipulate these parameters to achieve desired visual effects.`,
    folder: 'project0',
    image: '9mm.JPG', // fallback image
    images: ['9mm.JPG', '24mm.JPG', '28mm.JPG', '50mm.JPG', '70mm.JPG', '135mm.JPG', '800mm.JPG'],
    thumbnailType: 'composite',
    imageSets: [
      {
        name: 'focalLength',
        description: 'The Wrong Way vs. The Right Way',
        images: ['9mm.JPG', '24mm.JPG', '28mm.JPG', '50mm.JPG', '70mm.JPG', '135mm.JPG', '800mm.JPG'],
        captions: ['9mm', '24mm', '28mm', '50mm', '70mm', '135mm', '800mm']
      },
      {
        name: 'architecture',
        description: 'Architectural Perspective Compression',
        images: ['arch_14mm.jpeg', 'arch_24mm.jpeg', 'arch_48mm.jpeg', 'arch_77mm.jpeg'],
        captions: ['14mm', '24mm', '48mm', '77mm']
      }
    ],
    technologies: ['FOV', 'Perspective', 'Depth of Field', 'Projection'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project1',
    features: [
      'Focal length experimentation',
      'Perspective distortion analysis',
      'Dolly Zoom'
    ]
  },
  '2': {
    id: '2',
    title: 'Project 1',
    title_des:'Colorizing the Prokudin-Gorskii photo collection',
    description: 'Images of the Russian Empire: Colorizing the Prokudin-Gorskii photo collection',
    longDescription: `This projects the fundamentals in image and pixel manipulations. The goal was to recover a color image from the 
    black and white frames that are taken under Red, Green, and Blue filter. It explores the fundamental operation such as image alignment, channel composing, overlapping algorithmns, and use of Industrial-level computer vision library.`,
    folder: 'project1',
    image: 'prj1_thumbnail.png', // fallback image
    images: [],
    thumbnailType: 'composite',
    imageSets: [
      {
        name: 'Step 1: Image Slicing',
        description: 'The first step is to extract the three color channels from the grayscale composite image. Since the Prokudin-Gorskii images are vertically stacked (Blue, Green, Red from top to bottom), we slice the image into three equal parts by height. Each slice becomes a separate channel that will be aligned and combined.',
        images:[
          'siren_jpg.jpg',
          'siren_blue_channel.jpg',
          'siren_green_channel.jpg',
          'siren_red_channel.jpg',
        ],
        captions:[
          'Original composite image with three channels stacked vertically',
          'Blue channel',
          'Green channel',
          'Red channel'
        ]
      },
      {
        name: 'Step 2: Applying Image Processing Kernels',
        description: `To improve alignment accuracy, we apply convolution kernels to extract image features that are less sensitive to brightness variations. First, we apply a Gaussian blur kernel:

$$\\text{Gaussian} = \\frac{1}{16} \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 4 & 2 \\\\ 1 & 2 & 1 \\end{bmatrix}$$

Then we compute gradients using Sobel operators:

$$\\text{Sobel}_x = \\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix}, \\quad \\text{Sobel}_y = \\begin{bmatrix} -1 & -2 & -1 \\\\ 0 & 0 & 0 \\\\ 1 & 2 & 1 \\end{bmatrix}$$

This helps extract contour information while reducing the impact of varying illumination conditions. Note that the images on the right use NCC for alignment criterion`,
        images:[
          'siren_blue_channel.jpg',
          'Gaussian + Sobel for Blue channel of siren.jpg'
        ],
        captions:[
          'Original blue channel with varying brightness',
          'After Gaussian blur and Sobel edge detection - contours are emphasized'
        ]
      },
      {
        name: 'Step 3: The Power of Gradient-Based Alignment',
        description: 'This comparison demonstrates why gradient-based features are crucial for accurate alignment. Raw pixel values can be misleading due to different exposure conditions, reflections, and lighting variations between the color channels. By using edge information instead, we focus on structural features that remain consistent across channels.',
        images:[
          'siren_bad.jpg',
          'siren.jpg'
        ],
        captions:[
          'Without gradient filtering: Misalignment due to brightness differences and glare',
          'With gradient filtering: Proper alignment by focusing on structural edges'
        ]
      },
      {
        name: 'Step 4: Choosing the Right Similarity Metric',
        description: `Two different metrics were tested for measuring image similarity during alignment:

**L2 Norm (Euclidean Distance):** Fast but less robust to illumination changes
$$\\text{L2}(I_1, I_2) = \\sqrt{\\sum_{i,j} (I_1(i,j) - I_2(i,j))^2}$$

**Normalized Cross-Correlation (NCC):** Slower but more robust to brightness variations
$$\\vec{A} = \\frac{A - \\mu_A}{\\sigma_A + \\epsilon}, \\quad \\vec{B} = \\frac{B - \\mu_B}{\\sigma_B + \\epsilon}$$
$$\\text{NCC}(A, B) = \\frac{\\vec{A} \\cdot \\vec{B}}{\\|\\vec{A}\\| \\|\\vec{B}\\| + \\epsilon}$$

where $\\mu$ and $\\sigma$ are mean and standard deviation, and $\\epsilon = 10^{-8}$ prevents division by zero.

NCC provides significantly better results despite higher computational cost.`,
        images: ['L-2.jpg', 'NCC.jpg'],
        captions: ['L2 Norm: Poor alignment with displacement vectors (810, 810) and (-6, 34)', 
          'NCC: Accurate alignment with displacement vectors (-6, 58) and (-4, 34)']
      },
      {
        name: 'Channel Composition on Given Images',
        description: `Below are the all 14 composed Images based on the algorithmn I developed from the Prokudin-Gorskii photo collection. Note that for some images the performance is great, yet for some there are spaces to improve. 
        The displacement vector is included and in format of (x,y), where (0,0) represents the top left corner.The first vector presents the displacement
        for blue channel with respect to red, while the second represents green channel w.r.t to red.`,
        images: [
          'cathedral.jpg',
          'church.jpg', 
          'emir.jpg',
          'harvesters.jpg',
          'icon.jpg',
          'italil.jpg',
          'lastochikino.jpg',
          'lugano.jpg',
          'melons.jpg',
          'monastery.jpg',
          'self_portrait.jpg',
          'siren.jpg',
          'three_generations.jpg',
          'tobolsk.jpg'
        ],
        captions: [
          'Cathedral - Displacement vectors are (0, 12) and (0, 8)',
          'Church - Displacement vectors are (-14, 62) and (-8, 34)',
          'Emir - Displacement vectors are (40, 106) and (16, 58)',
          'Harvesters - Displacement vectors are (4, 124) and (-4, 64)',
          'Icon - Displacement vectors are (22, 90) and (6, 48)',
          'Italian Lake - Displacement vectors are (36, 76) and (14, 38)',
          'Lastochikino - Displacement vectors are (-8, 76) and (-6, 78)',
          'Lugano - Displacement vectors are (-28, 92) and (-12, 52)',
          'Melons - Displacement vectors are (10, 176) and (4, 96)',
          'Monastery - Displacement vectors are (0, 4) and (0, 6)',
          'Self Portrait - Displacement vectors are (36, 176) and (8, 98)',
          'Siren - Displacement vectors are (-16, 766) and (-18, 46)',
          'Three Generations - Displacement vectors are (8, 112) and (2, 58)',
          'Tobolsk - Displacement vectors are (4, 6) and (0, 4)'
        ]
      },
      {
        name: 'Self-selected Image',
        description: `These are the images I selected from Prokudin-Gorskii collection. The composing algorithmn also works decent on them! 
        The displacement vector are included and in format of (x,y), where (0,0) represents the top left corner. The first vector presents the displacement
        for blue channel with respect to red, while the second represents green channel w.r.t to red.`,
        images: ['self_choice_Napoleon.jpg',
            'Liesnaia_doroga.jpg',
            'crumbling_mosque.jpg',
            'by_the_Gundukush_dam.jpg'
        ],
        captions: ['Napoleon - Displacement vectors (0, 132) and (-4, 70)',
          'Liesnaia_doroga - Displacement vectors (4, 100) and (36, 58)',
          'The crumbling Mosque - Displacement vectors (10, 70) and (0, 44)',
          'By the Gundukush dam - Displacement vectors (-60, 132) and (-28, 74)'
        ]
      }
    ],
    technologies: ['Image Alignment', 'Channel Composition', 'Convolution', 'Image Pyramid', 'Image Overlapping Criterion'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project1',
    features: [
      'Image Pyramid',
      'OpenCV',
      'Gaussian',
      'Sobel',
      'Convolution',
      'Image Alignment and Cropping'
    ]
  }
}

// Export as array for Home component (easier to map over)
export const projectsArray = Object.values(projectsData)
