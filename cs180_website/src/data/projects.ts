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
      },
      {
        name: 'L-2 vs NCC Comparison',
        description: `Comparison between L-2 norm and Normalized Cross-Correlation (NCC) alignment methods`,
        images: ['L-2.jpg', 'NCC.jpg'],
        captions: ['L-2 Norm Result, the displacement vectors are (810, 810) and (-6, 34)', 
          'NCC Result, the displacement vectors are (-6, 58) and (-4, 34)']
      }
    ],
    technologies: ['Image Alignment', 'Channel Composition', 'Image Overlapping Criterion', 'Image Pyramid'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project1',
    features: [
      'Image Pyramid',
      'OpenCV',
      'Image Alignment and Cropping'
    ]
  }
}

// Export as array for Home component (easier to map over)
export const projectsArray = Object.values(projectsData)
