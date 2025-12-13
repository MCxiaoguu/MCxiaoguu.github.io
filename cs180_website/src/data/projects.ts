import { generateProject1Thumbnail } from '../utils/thumbnailGenerator'

// Code snippet interface for showcasing implementation
export interface CodeSnippet {
  language: string
  code: string
  filename?: string
  description?: string
}

// Shared project data for both Home and Project components
export interface ImageSubSection {
  name: string
  description: string
  images: string[]
  captions: string[]
  code?: CodeSnippet[]
  subSections?: ImageSubSection[]
}

export interface ImageSet {
  name: string
  description: string
  images: string[]
  captions: string[]
  subSections?: ImageSubSection[]
  code?: CodeSnippet[]
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
  },










  '3': {
    id: '3',
    title: 'Project 2',
    title_des: 'Fun with Filters and Frequencies!',
    description: 'Use Frequency Domain Filtering to Create Artistic Effects',
    longDescription: `This project explores the fundamentals of image filtering and frequency domain analysis. 
    We implement convolution operations from scratch, experiment with various filters including Gaussian, 
    finite difference operators, and derivative of Gaussian filters. The project also covers advanced 
    techniques like hybrid images, unsharp masking for image sharpening, and multi-resolution blending 
    using Gaussian and Laplacian stacks.`,
    folder: 'project2',
    image: 'selected_levels.png',
    images: [],
    thumbnailType: 'composite',
    imageSets: [
      {
        name: 'Part 1.1: Convolution Implementation',
        description: `The foundation of image filtering lies in the convolution operation. We implement 2D convolution from scratch using numpy, starting with the mathematical definition:

$$(f * g)(x, y) = \\sum_{m=-\\infty}^{\\infty} \\sum_{n=-\\infty}^{\\infty} f(m, n) \\cdot g(x - m, y - n)$$

For discrete images, this becomes a finite sum over the kernel dimensions. Our implementation includes proper zero-padding to handle boundary conditions, ensuring output images maintain the same dimensions as input images.

**Key Implementation Details:**
- **Four-loop approach:** Direct implementation following the mathematical definition
- **Two-loop optimization:** Vectorized operations for improved performance  
- **Boundary handling:** Zero-padding with configurable padding size
- **Verification:** Comparison with scipy.signal.convolve2d for accuracy

We test our implementation with various kernels including box filters and finite difference operators on grayscale images.
In general, the two-for loop approach is faster because it utilizes the vectorized approach from numpy.`,
        images: ["box_filter_applied.jpg"],
        captions: ["Applying a box filter through two-for loop and four-for loop convolution on my selfie in project0"],
        code: [
          {
            language: "python",
            filename: "convolution_four_loops.py",
            description: "Four-loop convolution: Direct implementation following mathematical definition",
            code: `def padding(image, pad_y, pad_x):
    img_y, img_x = image.shape  
    top_pad = np.zeros((pad_y, img_x))
    bottom_pad = np.zeros((pad_y, img_x))
    padded = np.concatenate((top_pad, image, bottom_pad), axis=0)
    
    left_pad = np.zeros((padded.shape[0], pad_x))
    right_pad = np.zeros((padded.shape[0], pad_x))    
    padded = np.concatenate((left_pad, padded, right_pad), axis=1)

    return padded
def convolution_four(image, kernel):
    img_y, img_x = image.shape 
    k_y, k_x = kernel.shape # kernel height, width
    pad_y, pad_x = k_y // 2, k_x // 2
    
    result = np.zeros_like(image, dtype=float)
    padded = padding(image, pad_y, pad_x).astype(np.float32)

    for yi in range(img_y):   #row
        for xi in range(img_x): #cols
            pixel_val = 0.0
            for yk in range(k_y):   # kernel row
                for xk in range(k_x): # kernel col
                    pixel_val += padded[yi + yk, xi + xk] * kernel[yk, xk]
            result[yi, xi] = pixel_val

    return result.astype(np.uint8) #Haha OpenCV...

# Example usage:
box_kernel = 1/81 * np.ones((9,9))
img = cv.imread("img/selfie.jpg")
gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
boxed_four = convolution_four(gray_img, box_kernel)`
          },
          {
            language: "python", 
            filename: "convolution_two_loops.py",
            description: "Two-loop convolution: Optimized with vectorized operations for better performance",
            code: `def convolution_two(image, kernel):
    img_y, img_x = image.shape 
    k_y, k_x = kernel.shape # kernel height, width
    pad_y, pad_x = k_y // 2, k_x // 2
    
    result = np.zeros_like(image, dtype=float)
    padded = padding(image, pad_y, pad_x).astype(np.float32)

    for yi in range(img_y):
        for xi in range(img_x):
            # Vectorized multiplication and sum - much faster!
            result[yi, xi] = np.sum(padded[yi:yi+k_y, xi:xi+k_x] * kernel)

    return result.astype(np.uint8)

# Example usage:
box_kernel = 1/81 * np.ones((9,9))
img = cv.imread("img/selfie.jpg") 
gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
boxed_two = convolution_two(gray_img, box_kernel)

# Performance comparison:
# Two-loop approach is significantly faster due to numpy vectorization`
          }
        ]
      },
      {
        name: 'Part 1.2: Finite Differences Kernel',
        description: `Edge detection begins with computing image gradients using finite difference operators. We use simple 1D kernels to approximate partial derivatives:

**Finite Difference Operators:**
$$D_x = \\begin{bmatrix} 1 & 0 & -1 \\end{bmatrix}, \\quad D_y = \\begin{bmatrix} 1 \\\\ 0 \\\\ -1 \\end{bmatrix}$$

The gradient magnitude combines both directional derivatives:
$$|\\nabla f| = \\sqrt{\\left(\\frac{\\partial f}{\\partial x}\\right)^2 + \\left(\\frac{\\partial f}{\\partial y}\\right)^2}$$
I used this magnitude for the latter part, the camereaman edge detection.
`,
        images: ["x-gradient_applied.jpg", "y-gradient_applied.jpg"],
        captions: ["Applying x-gradient operator", "Applying y-gradient operator"],
        code: []
      },
      {
        name: 'Cameraman Image Edge Detection: Two ways',
        description: `Raw finite difference operators are sensitive to noise. We improve edge detection by first smoothing the image with a Gaussian filter:

**2D Gaussian Kernel:**
$$G(x, y) = \\frac{1}{2\\pi\\sigma^2} e^{-\\frac{x^2 + y^2}{2\\sigma^2}}$$

**Approach 1: Sequential Convolution (Two Steps)**
Apply Gaussian smoothing first, then finite difference operators:
$$\\text{Step 1: } I_{smooth} = I * G$$
$$\\text{Step 2: } \\frac{\\partial I}{\\partial x} = I_{smooth} * D_x, \\quad \\frac{\\partial I}{\\partial y} = I_{smooth} * D_y$$

Where $D_x = \\begin{bmatrix} 1 & 0 & -1 \\end{bmatrix}$ and $D_y = \\begin{bmatrix} 1 \\\\ 0 \\\\ -1 \\end{bmatrix}$

**Approach 2: Derivative of Gaussian (One Step)**
Mathematically derive the Gaussian derivative kernels directly:
$$\\frac{\\partial G}{\\partial x} = -\\frac{x}{\\sigma^2} \\cdot G(x, y)$$
$$\\frac{\\partial G}{\\partial y} = -\\frac{y}{\\sigma^2} \\cdot G(x, y)$$

Then apply single convolution: $\\frac{\\partial I}{\\partial x} = I * \\frac{\\partial G}{\\partial x}$

**Benefits of DoG approach:**
- **Single convolution:** More computationally efficient (one pass instead of two)
- **Better localization:** Optimal trade-off between noise reduction and edge localization
- **Mathematical elegance:** Direct implementation of the derivative operation
- **Scale control:** sigma parameter controls both smoothing and derivative scale

The DoG filters provide cleaner edge detection with significantly reduced noise compared to raw finite differences.
Both approaches yield nearly identical results due to the associative property of convolution, but the single-step DoG is more efficient.

It can be observed that the result from both approaches are almost identical, thanks to the theoretical proof that convolution is associative.

**Process Steps:**
1. **Partial derivatives:** Convolve image with Dx and Dy operators
2. **Gradient magnitude:** Compute Euclidean norm of gradient vector
3. **Edge detection:** Apply threshold to create binary edge map
4. **Threshold selection:** Balance between noise suppression and edge preservation

The choice of threshold is critical - too low includes noise, too high misses important edges.`,

        images: ["grad_after_gaussian.jpg","derivative_of_gaussian.jpg"],
        captions: ["Approach 1: Gradient after Gaussian smoothing", "Approach 2: Direct Derivative of Gaussian filters"],
        code: []
      },
      {
        name: 'Part 2.1: Image Sharpening',
        description: `Unsharp masking enhances image sharpness by emphasizing high-frequency details. The technique derives from traditional photography darkroom methods:

**Mathematical Foundation:**
$$\\text{Sharp} = \\text{Original} + \\alpha \\cdot (\\text{Original} - \\text{Blurred})$$

Where the unsharp mask is: $\\text{Mask} = \\text{Original} - \\text{Blurred}$

**Step-by-Step Process:**
1. **Create blurred version:** Apply Gaussian filter to original image
2. **Extract high frequencies:** Subtract blurred from original  
3. **Amplify details:** Scale high-frequency component by factor α
4. **Combine:** Add amplified details back to original

**Single Convolution Form:**
$$\\text{Unsharp Filter} = (1 + \\alpha) \\cdot \\delta - \\alpha \\cdot G$$

Where δ is the impulse function and G is the Gaussian kernel.

**Parameter Effects:**
- **α > 0:** Sharpening (typical range: 0.5-2.0)
- **α = 0:** No change  
- **sigma:** Controls which frequencies are enhanced`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Straight Sharpening Results',
            description: 'Direct application of unsharp masking to the Taj Mahal image with varying α values. Notice how higher α values create more pronounced sharpening effects, but can also introduce artifacts.',
            images: ["straight_sharpened_taj_alpha_5.jpg", "straight_sharpened_taj_alpha_10.jpg", "straight_sharpened_taj_alpha_50.jpg"],
            captions: ["Sharpened with α=5 - Subtle enhancement", "Sharpened with α=10 - Moderate sharpening", "Sharpened with α=50 - Strong sharpening with visible artifacts"],
            code: [
              // {
              //   language: "python",
              //   filename: "unsharp_masking.py",
              //   description: "Implementation of unsharp masking for image sharpening with different approaches",
              //   code: ``
              // }
            ]
          },
          {
            name: 'Blur-then-Sharpen Evaluation',
            description: `To evaluate the effectiveness of unsharp masking, we first blur a sharp image, then attempt to recover sharpness. This test reveals the limitations of the technique - lost information cannot be perfectly recovered.
            However, it can be observed that for alpha around 5, straight sharpening and sharpening after blur gives little difference. This may be due to the lost of information primarily lying in the frequency domain
            that is not susceptible to sharpening/blurring.`,
            images: ["straight_sharpened_taj_alpha_5.jpg", "sharpen_after_blur_alpha_5.jpg", "sharpen_after_blur_alpha_20.jpg"],
            captions: ["Original sharp image (α=5)", "Sharpen After Gaussian blur (sigma=5)", "Sharpen After Gaussian blur (sigma=20)"]
          },
          {
            name: 'Sharpening Picture of Choice: Historic Image of Wheeler Hall',
            description: `Application of unsharp masking to a historic image of Wheeler Hall demonstrates the technique's effectiveness on architectural photography. The historic nature of the image provides interesting challenges due to the original image quality and characteristics of older photography techniques.`,
            images: ["wheeler_straight_sharpened_taj_alpha_1.jpg", "wheeler_straight_sharpened_taj_alpha_10.jpg", "wheeler_straight_sharpened_taj_alpha_50.jpg"],
            captions: ["Wheeler Hall sharpened with α=1 - Subtle enhancement", "Wheeler Hall sharpened with α=10 - Moderate sharpening", "Wheeler Hall sharpened with α=50 - Strong sharpening with visible artifacts"],
            code: []
          }
        ]
      },
      {
        name: 'Part 2.2: Hybrid Image Creation',
        description: `Hybrid images exploit the multi-scale nature of human vision. High frequencies dominate close viewing, while low frequencies are perceived at distance.

**Algorithm Overview:**
1. **Image alignment:** Carefully align two input images
2. **Low-pass filtering:** Apply Gaussian filter to first image
3. **High-pass filtering:** Subtract Gaussian-filtered from second image
4. **Combination:** Add/average the filtered results

**Mathematical Formulation:**
$$\\text{Hybrid} = \\text{LowPass}(\\text{Image}_1) + \\text{HighPass}(\\text{Image}_2)$$

Where:
$$\\text{LowPass}(I) = I * G_{\\sigma_1}$$
$$\\text{HighPass}(I) = I - I * G_{\\sigma_2}$$

**Critical Parameters:**
- **sigma1 (low-pass cutoff):** Controls which frequencies from Image1 to retain
- **sigma2 (high-pass cutoff):** Controls which frequencies from Image2 to retain  
- **Alignment quality:** Misalignment creates artifacts
- **Frequency balance:** Ratio between low and high frequency components`,
        images: [],
        captions: [],
        code: [
          // {
          //   language: "python",
          //   filename: "hybrid_image.py",
          //   description: "Implementation of hybrid image creation using low-pass and high-pass filtering",
          //   code: ``
          // }
        ],
        subSections: [
          {
            name: 'Derek and Nutmeg Hybrid',
            description: 'The classic example from the original paper: Derek (low frequencies) combined with his cat Nutmeg (high frequencies). When viewed from close, you see the cat details. When viewed from far, Derek becomes more prominent.',
            images: ["DerekPicture_aligned1.png", "DerekPicture_aligned2.png", "DerekPicture_hybrid.png"],
            captions: ["Derek (low-pass component)", "Nutmeg (high-pass component)", "Hybrid Result"]
          },
          {
            name: 'Frequency Domain Analysis',
            description: `The following plots are the FFT chart of the original and hybrid image. Our hybrid schema is to take the high frequency component from Nutmeg and low frequency component from Derek.
            The FFT chart shows that the hybrid image successfully combines the low frequencies from Derek and high frequencies from Nutmeg, demonstrating the effectiveness of frequency domain filtering in hybrid image creation. Specifically, pay
            attention to the diagonal components in the Derek image, which are preserved in the hybrid image's low-frequency region.
            Thanks to human perception, when viewed from a distance, the low-frequency Derek image dominates our perception, while close up, the high-frequency Nutmeg details become more apparent.`,
            images: ["DerekPicture_nutmeg_hybrid_comparison.png"],
            captions: ["FFT chart and frequency domain analysis of hybrid image creation"]
          },
          {
            name: 'Yuhua and Dog Portrait Hybrid',
            description: 'On Chinese Internet, a majority of people are familiar with the meme of comparing the renowned Chinese author Yuhua as a cute dog. Therefore, I wondered if there truly have sucA custom hybrid combining two different expressions/poses of Yuhua. This demonstrates the technique on portrait photography with different facial expressions, creating an intriguing perceptual shift based on viewing distance.',
            images: ["yuhua_aligned1.jpg", "yuhua_aligned2.jpg", "yuhua_hybrid.jpg"],
            captions: ["Yuhua Expression 1 (low-pass component)", "Yuhua Expression 2 (high-pass component)", "Yuhua Hybrid Result"]
          },
          {
            name: 'Hybrid Image: Walter White Werner Heisenberg',
            description: `In the famous TV show, Breaking Bad, the character Walter White undergoes a dramatic transformation. He called himself "Heisenberg". This hybrid for one serves as a funny comparison between the real and the claimed persona, 
            as well as showcasing the transformation theme using Walter White character images. This example demonstrates how hybrid images can create compelling narrative effects, with different personas visible at different viewing distances.`,
            images: ["walter_white_aligned1.jpg", "walter_white_aligned2.jpg", "walter_white_hybrid.jpg"],
            captions: ["Walter White Look 1 (low-pass component)", "Werner Heisenberg, the famous German physicist", `Walter "Heisenberg" White Hybrid Result`]
          }
        ]
      },
      {
        name: 'Part 2.3: Image Stacks',
        description: `Use Gaussian and Laplacian to create image stacks for the next part.
        The idea is to preserve the scale of the image, and iteratively convolute the image with the Gaussian (to get the Gaussian stack)
        and find the difference between two consecutive Gaussian stack (to get the Laplacian stack).`,
        images: ["selected_levels.png"],
        captions: [`Gaussian and Laplacian stacks for the orange. The column on the left is the Gaussian stack, while the right column is the Laplacian stack. The top row is the original image. 
          Note that since it contains only 5-levels, the fifth level in the Laplacian is the residual, which is similar to the same-level image in the Gaussian stack.`],
        code: [
          // {
          //   language: "python",
          //   filename: "image_stacks.py",
          //   description: "Implementation of Gaussian and Laplacian stacks for multi-resolution image analysis",
          //   code: ``
          // }
        ]
      },
      {
        name: 'Part 2.4: Multi-resolution Blending and the Oraple journey',
        description: `Multi-resolution blending creates seamless transitions by blending at multiple frequency levels simultaneously:

**Blending Algorithm:**
1. **Create stacks:** Build Gaussian and Laplacian stacks for both input images
2. **Mask stack:** Create Gaussian stack for binary mask (smooths transition)
3. **Blend each level:** 
   $$L_{\\text{blend}}^{(i)} = M^{(i)} \\cdot L_1^{(i)} + (1-M^{(i)}) \\cdot L_2^{(i)}$$
4. **Reconstruct:** Sum all blended Laplacian levels

**Mathematical Foundation:**
$$\\text{Result} = \\sum_{i=0}^{N-1} L_{\\text{blend}}^{(i)}$$

**Mask Design:**
- **Simple masks:** Vertical/horizontal step functions
- **Irregular masks:** Hand-drawn or computed based on image content
- **Feathering:** Gaussian blur of mask creates smooth transitions

**Why Multi-resolution Works:**
- **Lower Frequency (Coarse scales):** Handle large-scale transitions and overall composition
- **Higher Frequency (Fine scales):** Preserve texture details and sharp features
- **Natural blending:** Avoids visible seams by respecting image structure at all scales
- Note that in the second trial I've adopted two different Gaussian kernel for the images. This is to deal with the issue that at difference frequencies the blurring are to be different. For example, at low frequency, the transition is more gradual, therefore a larger Gaussian kernel is needed to smooth the transition.


The key insight is that different spatial frequencies require different blending strategies - multi-resolution handles this automatically.`,
        images: ["oraple_first_try.jpg", "blended_orange_apple_second.jpg"],
        captions: ["My first attempt at Oraple (sigma =5 for both mask and the image) - half apple, half orange. The vertical seam is clearly visible due to abrupt transition.", 
          `My second attempt at blending (sigma = 5 for image , sigma = 15 for mask) - the transition is much smoother. 
          This is achieved through applying two different Gaussian kernel on the mask and the images itself.`],
        code: [
          // {
          //   language: "python",
          //   filename: "multiresolution_blending.py",
          //   description: "Implementation of multi-resolution blending using Gaussian and Laplacian stacks",
          //   code: ``
          // }
        ]
      },
      {
        name: 'Additional Examples of Multi-resolution Blending (Set 1)',
        description: `This set consists the famous Albert Einstein picture where he is sticking out his tongue, blended with a human eye. The mask is hand-drawn to create a more interesting transition.
        I believe such blending is already prevalent on the Internet!
        `,
        images: ["ab_tongue.jpeg", "eye.jpg", "eye+ab.jpg", "eye_mask.jpg"],
        captions: ["Albert Einstein sticking out his tongue", "Human eye", "Blended Result", "Mask used for blending"],
      },
      {
        name: 'Additional Examples of Multi-resolution Blending (Set 2)',
        description: `Here are two set of pictures I've blended using the multi-resolution blending technique. The first set is a blend between a cat and a dog.`,
        images: ["dachshund_headshot.jpg", "border_collie_for_blending.jpg", "two_dogs.jpg", "dogs_mask.jpg"],
        captions: ["Dachshund headshot", "Border collie for blending", "Blended Result", "Mask used for blending"],
      }
    ],
    technologies: ['Convolution', 'Gaussian Filters', 'Edge Detection', 'Frequency Analysis', 'Hybrid Images', 'Multi-resolution Blending', 'Unsharp Masking'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project2',
    features: [
      'Custom Convolution Implementation',
      'Finite Difference Operators',
      'Derivative of Gaussian Filters', 
      'Gradient Orientation Visualization',
      'Image Sharpening',
      'Hybrid Image Creation',
      'Gaussian and Laplacian Stacks',
      'Multi-resolution Blending'
    ]
  }
  ,
  '4': {
    id: '4',
    title: 'Project 3',
    title_des: 'Image Warping and Mosaicing',
    description: 'Homographies, Image Warping, and Photo Mosaics',
    longDescription: ``,
    folder: 'project3',
    image: 'file_big_sur_phone_bilinear.jpg',
    images: [],
    thumbnailType: 'single',
    imageSets: [
      {
        name: 'A.1: Shoot the Pictures',
        description: `We capture image pairs suitable for homography estimation.

• Same center of projection: two landscapes captured from the same location with small rotational changes.
• Different viewpoints: two photos of the same indoor scene taken from different angles, introducing perspective changes.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Same Center of Projection (Landscape Pair)',
            description: `Two landscapes shot from the same position. Photos are taken at Big Sur, CA`,
            images: ['big_sur_left.jpg', 'big_sur_right.jpeg'],
            captions: [
              'Big Sur (left view, same COP)',
              'Big Sur (right view, same COP)'
            ]
          },
          {
            name: 'Same Center of Projection',
            description: 'Another set of images share the same COP',
            images: ['ehub_left.jpg', 'ehub_right.jpg'],
            captions: [
              'Left side of the building',
              'Right side of the building'
            ]
          }
        ]
      },
      {
        name: 'A.2: Recover Homographies',
        description: `We estimate a homography H that maps homogeneous source coordinates x = [x, y, 1]^T to destination x' = [x', y', 1]^T up to scale:

$$s \\begin{bmatrix} x' \\\\ y' \\\\ 1 \\end{bmatrix} =
H \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix},\\quad
H = \\begin{bmatrix}
h_{11} & h_{12} & h_{13} \\\\
h_{21} & h_{22} & h_{23} \\\\
h_{31} & h_{32} & h_{33}
\\end{bmatrix}.$$

From point correspondences $(x, y) \\leftrightarrow (x', y')$, we derive two linear equations per correspondence (DLT):

$$\\begin{aligned}
x' &= \\frac{h_{11}x + h_{12}y + h_{13}}{h_{31}x + h_{32}y + h_{33}},\\\\
y' &= \\frac{h_{21}x + h_{22}y + h_{23}}{h_{31}x + h_{32}y + h_{33}}.
\\end{aligned}$$

Multiply both sides by the denominator to eliminate fractions:

$$\\begin{aligned}
x'(h_{31}x + h_{32}y + h_{33}) &= h_{11}x + h_{12}y + h_{13},\\\\
y'(h_{31}x + h_{32}y + h_{33}) &= h_{21}x + h_{22}y + h_{23}.
\\end{aligned}$$

Expand both equations:


$$\\begin{aligned}
h_{11}x + h_{12}y + h_{13} - x'h_{31}x - x'h_{32}y - x'h_{33} &= 0,\\\\
h_{21}x + h_{22}y + h_{23} - y'h_{31}x - y'h_{32}y - y'h_{33} &= 0.
\\end{aligned}$$

Rearrange to group coefficients of each unknown:


$$\\begin{aligned}
x h_{11} + y h_{12} + 1 h_{13} + 0 h_{21} + 0 h_{22} + 0 h_{23}
 - x x' h_{31} - y x' h_{32} - x' h_{33} &= 0,\\\\
0 h_{11} + 0 h_{12} + 0 h_{13} + x h_{21} + y h_{22} + 1 h_{23}
 - x y' h_{31} - y y' h_{32} - y' h_{33} &= 0.
\\end{aligned}$$

This gives two linear equations per correspondence, which can be stacked as:

$$\\begin{bmatrix}
x & y & 1 & 0 & 0 & 0 & -xx' & -yx' & -x' \\\\
0 & 0 & 0 & x & y & 1 & -xy' & -yy' & -y' 
\\end{bmatrix}
\\begin{bmatrix}
h_{11} \\\\ h_{12} \\\\ h_{13} \\\\ h_{21} \\\\ h_{22} \\\\ h_{23} \\\\ h_{31} \\\\ h_{32} \\\\ h_{33}
\\end{bmatrix}
= \\mathbf{0}.$$

Computed Homography matrix for image set below:
$$H = \\begin{bmatrix}
            1.54 & -0.12 & -581.57 \\\\
            0.31 & 1.36 & -153.22 \\\\
            0.00 & -0.00 & 1.00
\\end{bmatrix}$$
It comes from letting the computer solve the system of equations using the least square.:
Note that we use (0,0) on the top-left corner as the convention here and throughout this project.
$$\\begin{aligned}
\\textbf{(1)}\\quad
x'_1 &= h_{11}(807.38) + h_{12}(12.39) + h_{13} \\approx 660.30,\\\\
y'_1 &= h_{21}(807.38) + h_{22}(12.39) + h_{23} \\approx 113.91;\\\\[6pt]

\\textbf{(2)}\\quad
x'_2 &= h_{11}(748.83) + h_{12}(276.41) + h_{13} \\approx 538.45,\\\\
y'_2 &= h_{21}(748.83) + h_{22}(276.41) + h_{23} \\approx 454.84;\\\\[6pt]

\\textbf{(3)}\\quad
x'_3 &= h_{11}(784.18) + h_{12}(263.16) + h_{13} \\approx 594.48,\\\\
y'_3 &= h_{21}(784.18) + h_{22}(263.16) + h_{23} \\approx 447.77;\\\\[6pt]

\\textbf{(4)}\\quad
x'_4 &= h_{11}(479.28) + h_{12}(424.45) + h_{13} \\approx 105.58,\\\\
y'_4 &= h_{21}(479.28) + h_{22}(424.45) + h_{23} \\approx 572.60;\\\\[6pt]

\\textbf{(5)}\\quad
x'_5 &= h_{11}(861.51) + h_{12}(424.45) + h_{13} \\approx 694.22,\\\\
y'_5 &= h_{21}(861.51) + h_{22}(424.45) + h_{23} \\approx 691.09;\\\\[6pt]

\\textbf{(6)}\\quad
x'_6 &= h_{11}(899.07) + h_{12}(675.22) +h_{13} \\approx 721.97,\\\\
y'_6 &= h_{21}(899.07) + h_{22}(675.22) + h_{23} \\approx 1043.79;\\\\[6pt]

\\textbf{(7)}\\quad
x'_7 &= h_{11}(861.51) + h_{12}(230.02) + h_{13} \\approx 717.55,\\\\
y'_7 &= h_{21}(861.51) + h_{22}(230.02) + h_{23} \\approx 426.67;\\\\[6pt]

\\textbf{(8)}\\quad
x'_8 &= h_{11}(882.50) + h_{12}(372.52) + h_{13} \\approx 732.77,\\\\
y'_8 &= h_{21}(882.50) + h_{22}(372.52) + h_{23} \\approx 626.99.\\\\
\\end{aligned}$$

`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Example Set: ',
            description: `Point correspondences for the pictures taken at eHub.`,
            images: ['point_selection_ehub_fullsize.png'],
            captions: [
              'Point correspondences selected on the two images'
            ]
          }
          // ,
          // {
          //   name: 'Example Set 2: Facade Rectification',
          //   description: 'Rectifying a building facade using lines/corners as correspondences.',
          //   images: [' ', ''],
          //   captions: [
          //     'Original facade image',
          //     'Rectified facade using recovered H'
          //   ]
          // }
        ]
      },
      {
        name: 'A.3: Warp the Images',
        description: `We perform inverse warping using the estimated homography $H$.
For each destination pixel $\\mathbf{x'}$, compute $\\mathbf{x} = H^{-1}\\mathbf{x'}$ in the source image and sample its value.

Nearest Neighbor (NN):
$$I_{\\text{NN}}(x',y') = I\\big(\\operatorname{round}(x),\\operatorname{round}(y)\\big).$$

Bilinear Interpolation:
Let $x_0=\\lfloor x \\rfloor,\\; y_0=\\lfloor y \\rfloor,\\; d_x=x-x_0,\\; d_y=y-y_0$. Then
$$\\begin{aligned}
I_{\\text{bilinear}}(x',y') &= (1-d_x)(1-d_y)I(x_0,y_0) + d_x(1-d_y)I(x_0+1,y_0) + (1-d_x)d_y I(x_0,y_0+1) + d_x d_y I(x_0+1,y_0+1).
\\end{aligned}$$

Procedure:
1) Compute the output canvas and translation if needed. 
2) For each pixel in the destination, map with $H^{-1}$ to source. 
3) Sample with NN or bilinear. 
4) Produce a binary mask (valid-source) for blending.

Performance notes: In general bilinear is way slower than nearest neighbor, since it accounts more pixel per interpolation. This becomes 
evident especially when the canvas size is larger, as can be seen below.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Set 1: Warp and Masks',
            description: 'Original, masks generated by NN and bilinear, and the rectified results.',
            images: ['macallans.jpg', 'macallans_warped_mask_nn.jpg', 'macallans_warped_mask_bilinear.jpg', 'macallans_warped_nn.jpg', 'macallans_warped_bilinear.jpg'],
            captions: [
              'Original image',
              'Mask (Nearest Neighbor)',
              'Mask (Bilinear)',
              'Rectified image (NN)',
              'Rectified image (Bilinear)'
            ]
          },
          {
            name: 'Set 1 - Nearest Neighbour and Bilinear Interpolation Comparison',
            description: `After zooming in, we can see the difference between NN and bilinear interpolation. 
                The former produces blocky artifacts, which introduces the alias for the text (that has sharp edge), while the latter is smoother.
                Performance-wise: N.N. took around 4.7s, while bilinear took around 10.8s. for raw image size of around 1300x1000 and canvas size of 1000x2300`,
            images: ['macallans_warped_nn_zoomed.jpg', 'macallans_warped_bilinear_zoomed.jpg'],
            captions: [
              'Zoomed Feature for Nearest Neighbor',
              'Zoomed Feature for Bilinear Interpolation'
            ]
          },
          {
            name: 'Set 2: Warp and Masks',
            description: `Second example set showing NN vs. bilinear behavior.
              Performance-wise: N.N. took around 79.8s, while bilinear took around 170.3s. for raw image size of around 1000x1300 and canvas size of 8000x5000`,
            images: ['provia_sd_card.jpg', 'provia_sd_card_warped_mask_nn.jpg', 'provia_sd_card_warped_nn.jpg', 'provia_sd_card_cropped.jpg'],
            captions: [
              'Original image',
              'Mask (Nearest Neighbor)',
              'Rectified image (NN)',
              'Cropped to only take the region desired'
            ]
          }
        ]
      },
      {
        name: 'A.4: Blend the Images into a Mosaic',
        description: `We create seamless mosaics by warping multiple images into a common canvas and blending them.

Workflow:<br/> 
1) Manually select N correspondences between image pairs. <br/> 
2) Estimate $H$ and compute any necessary translation to a common canvas.<br/> 
3) Inverse warp images into the canvas using $H$ (translation-corrected).<br/> 
4) Build Laplacian pyramids of images and a Gaussian pyramid of the mask.<br/> 
5) Blend at each pyramid level and reconstruct the final mosaic.<br/> 
We include screenshots of the correspondence selection UI and the binary/feathered mask used in blending.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Point Selection and Masking',
            description: 'Screenshots from the interactive point selection tool and the constructed mask.',
            images: ['point_selection_ehub_fullsize.png', 'example_mask.jpg'],
            captions: [
              "Screenshot: Point correspondences selected on the two images",
              "Mask used for the left image used for blending"
            ]
          },
          {
            name: 'Mosaic 1',
            description: `Two sources and the resulting blended mosaic,
            Note that here due to the exposure difference, the left side is brighter.`,
            images: ['ehub_left.jpg', 'ehub_right.jpg'],
            captions: [
              'Left Side',
              'Right Side'
            ]
          },
          {
            name: '',
            description: '',
            images: ['file_ehub_bilinear.jpg'],
            captions: [
              'Final mosaic'
            ]
          },
          {
            name: 'Mosaic 2',
            description: `Second mosaic example with a different scene.
            Note that since the exposure and color temperature, despite attempt to correct,
            are different, some margins is still evident.`,
            images: ['big_sur_left.jpg', 'big_sur_right_adj_exp+temp.jpg'],
            captions: [
              'Left Side',
              'Right Side'
            ]
          },
          {
            name: '',
            description: '',
            images: ['file_big_sur_bilinear.jpg'],
            captions: [
              'Final mosaic'
            ]
          },
          {
            name: 'Mosaic 3',
            description: `The third mosaic example. Shot with phone, containing different part of the Big Sur.
            Note that since the exposure and color temperature, despite attempt to correct,
            are different, some margins is still evident.`,
            images: ['big_sur_phone_left.jpg', 'big_sur_phone_right.jpg'],
            captions: [
              'Left Side',
              'Right Side'
            ]
          },
          {
            name: '',
            description: '',
            images: ['file_big_sur_phone_bilinear.jpg'],
            captions: [
              'Final mosaic'
            ]
          }
        ]
      },
      {
        name: 'B.1: Harris Corner Detection',
        description: `Below are the harris corner detection results on the provided images. The first one on the left
        is the harris corner without any filtering (and thus provides no information because the dots are all over the place!), 
        the second one filters out the strongest 100 corners, and the last one uses ANMS to select 100 equally spaced corner features. `,
        images: [],
        captions: [],
        subSections: [
          {
            name: '',
            description: '',
            images: ["harris_ehub_left_all.jpg", "harris_ehub_left_strongest_100.jpg", "anms_200_ehub_left.jpg"],
        captions: ["Harris corners (all)", "Harris corners (strongest 100)", "Harris corners (filtered using ANMS 100)"],
            code: [
              {
                language: "python",
                filename: "example_code.py", 
                description: "Description of what this code does",
                code: `def example_function():
          # Your code here
          pass`
              }
            ]
          }
        ]
      },
      {
        name: 'B.2: Feature Descriptor Extraction',
        description: `I used the ANMS to extract 8x8 patches by find a 40 by 40 window at each corner, followed
        by downsampling to 8x8. Then I take the gradient and find the dominant direction. The patches are then normalized to have zero mean and unit variance to account for illumination changes.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: '',
            description: '',
            images: ['sbCross_features_N200.jpg'],
            captions: ['Extracted features from the image'],
          },
          {
            name: '',
            description: '',
            images: ["sbCross.jpg", "sbCross_features_extraction_N200.jpg"],
            captions: ["Original Image", "Image with patches"]
          }
        ]
        // code: [
        //   {
        //     language: "python",
        //     filename: "section_code.py",
        //     description: "Code explanation",
        //     code: `# Your implementation here`
        //   }
        // ]
      },
      {
        name: 'B.3: Feature Matching',
        description: `Below are some of the matched features. Note that some of them are mismatched, which is expected due to the similarity of some features.
        Therefore in the next section we will use RANSAC to filter out the outliers. I used threshold = 0.7 as the same in the original MOPS paper.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Feature matching for the E-hub images',
            description: '',
            images: ['ehub_feature_matches.jpg'],
            captions: ['Matched Features. Note that there are some mismatches and some features that map to the same on among images']
          },
          {
            name: 'Feature matching for the Big Sur images',
            description: '',
            images: ['big_sur_phone_feature_matches.jpg'],
            captions: ['Matched Features. Note that there are some mismatches and some features that map to the same on among images']
          }
        ]
      },
      {
        name: 'B.4: RANSAC for Robust Homography',
        description: `Since feature matching sometimes yield not so decent results, we can use RANSAC to filter out the outliers through repeated sampling and consensus`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Autostitching using RANSAC: Set 1',
            description: `The left is stitched through manual point selection, 
            while the right one is stitched through RANSAC feature matching. The RANSAC did pretty well
            and managed to filter out most of the outliers and matched the performance of the manual selection stitching`,
            images: ['file_big_sur_phone_bilinear.jpg', 'big_sur_phone_panorama.jpg'],
            captions: [
              'Stitched through manual point selection',
              'Stitched through RANSAC feature matching'
            ]
          },
          {
            name: 'Autostitching using RANSAC: Set 2',
            description: `I used the inlier tolerance of 5 pixels, meaning that a feature will only be selected if the 
            reprojection error is within 5 pixels. The left is stitched through manual point selection,`,
            images: ['file_ehub_bilinear.jpg', 'ehub_panorama.jpg'],
            captions: [
              'Stitched through manual point selection',
              'Stitched through RANSAC feature matching'
            ]
          },
          {
            name: 'Autostitching using RANSAC: stitching more than 2 photos',
            description: `From this it can be seen that even for the vertical panorama stitching, RANSAC can hold it pretty well`,
            images: ['grimes_panorama.jpg'],
            captions: [
              'Stitch panorama using 4 photos captured at Grimes Engineering Center'
            ]
          },
          {
            name:'',
            description: 'The below four images are used for composing the above panorama vertially.',
            images: ['g_1.jpg', 'g_2.jpg', 'g_3.jpg', 'g_4.jpg'],
            captions: []
          }

        ]
      }
    ],
    technologies: ['Homography', 'Inverse Warping', 'Nearest Neighbor', 'Bilinear Interpolation', 'Image Rectification', 'Laplacian Pyramid Blending'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project3',
    features: [
      'Manual Correspondence Selection',
      'Robust Homography Calculation',
      'Rectification and View Synthesis',
      'Seamless Multi-scale Mosaic Blending'
    ]
  },
  '5': {
    id: '5',
    title: 'Project 4',
    title_des: 'Neural Fields and Radiance Fields',
    description: 'Store 3D in the digital eternity',
    longDescription: `This project fits continuous neural representations at two scales: a 2D neural field for single-image regression, and a full Neural Radiance Field (NeRF) from multi-view images including rendering and evaluation. We begin with camera calibration and 3D scanning visualization, then explore positional encoding, network width/depth, and training stability for neural fields. Finally we implement volume rendering for NeRF, visualize rays/samples, track PSNR, and render spherical videos on the LEGO dataset and our own capture.`,
    folder: 'project4',
    image: 'otter_L20_channelwidth512_lr0.001_epochs2000_samples1024.png',
    images: [],
    thumbnailType: 'single',
    imageSets: [
      {
        name: 'Part 0: Camera Calibration and 3D Scanning',
        description: ``,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Frustum Visualization',
            description: 'Camera frustums of my dataset in Viser. ',
            images: ['frusta.png', 'frusta_after_undistortion.png'],
            captions: ['Camera frustums', 'Camera frustums - after undistortion']
          }
        ]
      },
      {
        name: 'Part 1: Fit a Neural Field to a 2D Image',
        description: `Fitting an image with a coordinate MLP using positional encoding.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Model Architecture Report',
            description: `Hyperparameters for 2D NeRF.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'python',
                filename: '',
                description: 'Hyperparameters',
                code: 
`Learning Rate: 1e-3
Optimizer: Adam
Hidden Size: 256 to 1024 (see images below)
Positional Encoding Frequency L: 10 to 100 (see images below)
  - Larger L for to learn higher frequency details
Training Iterations: 1,000 to 5,000 
  - Larger hidden size needs more iterations`
              }
            ]
          },
          {
            name: 'Training Progression (Provided + Own Image)',
            description: 'As more epochs are trained, the reconstruction improves significantly,especially at the higher frequency, capturing finer details and colors.',
            images: ['fox_val_epoch10_L100_cw512_lr0.001.png','fox_val_epoch400_L100_cw512_lr0.001.png','fox_val_epoch800_L100_cw512_lr0.001.png','fox_val_epoch1600_L100_cw512_lr0.001.png','fox_like.jpg',
              'otter_val_epoch10_L100_cw512_lr0.001.png','otter_val_epoch400_L100_cw512_lr0.001.png','otter_val_epoch800_L100_cw512_lr0.001.png','otter_val_epoch1600_L100_cw512_lr0.001.png', 'sea_otter.jpg'
            ],
            captions: ["Provided Fox image at 10 epochs","400 epochs","800 epochs","1600 epochs", "Original Image",
              "My selected Image - Sea otter at 10 epochs", "400 epochs", "800 epochs", "1600 epochs", "Original Image" ]
          },
          {
            name: 'Final Results: 2x2 Sweep (L and Width)',
            description: '',
            images: ["otter_L20_channelwidth512_lr0.001_epochs2000_samples1024.png","otter_L20_channelwidth1024_lr0.001_epochs5000_samples1024.png",
              "otter_L100_channelwidth512_lr0.001_epochs2000_samples1024.png","otter_L100_channelwidth1024_lr0.001_epochs5000_samples1024.png"],
            captions: ["L=20, width=512", "L=20, width=1024", "L=100, width=512", "L=100, width=1024"]
          },
          {
            name: 'PSNR Curve',
            description: 'PSNR over training for L=20, width=1024 of the sea otter image.',
            images: ['otter_psnr_L20_width1024_lr0.001_epochs5000_samples1024.png'],
            captions: ['PSNR over training, L=20, width=1024']
          }
        ]
      },
      {
        name: 'Part 2: Fit a Neural Radiance Field from Multi-view Images',
        description: ``,
        images: ['nerf_lego_spherical_render.gif'],
        captions: [],
        subSections: [
          {
            name: 'Implementation Overview',
            description: `Step-by-step of what I implemented:<br/><br/>
1) Ray Generation<br/>
 For each pixel and camera (intrinsics/extrinsics), form a primary ray in world coordinates (origin and direction).<br/><br/>

2) Stratified Sampling Along Rays<br/>
 Select near/far planes and draw Nc samples per ray with stratification; store per-segment lengths for compositing.<br/><br/>

3) Positional Encoding<br/>
 Apply positional encoding to 3D sample points (and to view directions for view-dependent color).<br/><br/>

4) MLP Architecture (see figure)<br/>
 Fully-connected MLP (width W, depth D, ReLU) with a mid-network skip. Two heads: a non-negative density head, and a color head that takes a bottleneck feature plus encoded view direction to predict RGB in [0,1]. I followed the attached MLP layout (mlp_nerf.png).<br/><br/>

5) Volume Rendering (Discrete)<br/>
 Convert predicted densities into opacities and composite colors front-to-back using accumulated transmittance and per-sample weights.<br/><br/>

6) Loss and Metrics<br/>
 Optimize MSE on rendered vs ground-truth pixel colors, and track PSNR throughout training.<br/><br/>

7) Training Details<br/>
 Batch a set of rays per step (e.g., 1024), train with Adam (fixed or decayed learning rate), log PSNR, and periodically render validation views.`,
            images: ["mlp_nerf.png"],
            captions: ["NeRF MLP Architecture"]
          },
          {
            name: 'Rays and Samples Visualization',
            description: 'Up to 100 rays from a few cameras, with sample points',
            images: ['lego_rays_after_single_step.png'],
            captions: ['Points from 100 Rays on a single camera frustum']
          },
          {
            name: 'Training Progression (LEGO)',
            description: 'Predicted images across iterations. The inputs are the validation camera-to-word matrices',
            images: ['nerf_images_progression.png'],
            captions: ['Iter 0, 200, 400, 800, 2000, and 4000 (out of 5000 iterations) respectively']
          },
          {
            name: 'Validation PSNR Curve',
            description: 'Plot PSNR on the validation set over training.',
            images: ['nerf_psnr_curve.png'],
            captions: ['Validation PSNR for the Lego dataset']
          },
          {
            name: 'Spherical Rendering (LEGO)',
            description: `A 360-degree novel-view render around the object<br/>
            (If the video is not showing up in the pdf, try visit the website.)`,
            images: ['nerf_lego_spherical_render.mp4'],
            captions: ['Spherical orbit render (LEGO)']
          }
        ]
      },
      {
        name: 'Part 2.6: Training with Your Own Data',
        description: `I captured a set of 20 images of a dinosaur figurine using a macro lens with camera.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Novel View GIF',
            description: 'Camera circling your object showing novel views.',
            images: ['dino_orbit.mp4'],
            captions: ['Novel view render for my own dataset']
          },
          {
            name: 'Implementation Notes',
            description: `The hyperparameters I used for training on my own dataset are as follows:`,
            images: [],
            captions: [],
            code: [
              {
                language: 'python',
                filename: '',
                description: '',
                code: 
`Positional Encoding layer for rays = 24
Postional Encoding layer for input = 100
Channel width: 256
Far: 2.0 (see below)
Near: 0.8
Number of samples: 64
Number of epochs: 5000
Batch size: 10k
`
              }
            ]
          },
          {
            name:'Near/Far Selection Trick',
            description: `Near/Far Selection Trick:<br/>
            Because the near and far for the LEGO dataset and my own set of image are different, I had to adjust the near/far planes accordingly.<br/>
            To quickly select the values without retraining from scratch each time, I inspect them by
            tracking the rays in the visers.
            The image on the left showed a suboptimal near/far selection where many samples are outside the object of interest (especially behind the camera frustums),
            while the right image shows the improved selection, where most samples are within the object volume.<br/>
            The selected value was also in accordance with my photographing setup: I used a 100mm Nikkor micro lens!
            `,  
            images:["viser_before_select_near_far.png", "viser_after_select_near_far.png"],
            captions:["Viser Before Select Near/Far","Viser After Select Near/Far"]
          },
          {
            name: 'Training Loss Curve',
            description: 'Plot your training loss over iterations.',
            images: ['dino_training_loss.png', 'dino_psnr_curve.png'],
            captions: ['Training MSE Loss', 'Validation PSNR']
          },
          {
            name: 'Intermediate Renders (Total iterations: 5000)',
            description: 'Snapshots throughout training to show qualitative improvements.',
            images: ['dino_Lpos30_Ldir12_ch256_samp64_epoch750.png', 
              'dino_Lpos100_Ldir24_ch256_samp64_epoch1500.png', 
              'dino_Lpos100_Ldir24_ch256_samp64_epoch2500.png', 
              'dino_Lpos100_Ldir24_ch256_samp64_epoch3500.png',
              'dino_original_img.jpg'
            ],
            captions: ['Iter 750', 'Iter 1500', 'Iter 2500', 'Iter 3500', 'Original Image']
          }
        ]
      }
    ],
    technologies: ['Calibration', 'Positional Encoding', 'MLP', 'Volume Rendering', 'NeRF', 'PSNR'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project4',
    features: [
      'Camera calibration and frustum visualization',
      '2D neural field image fitting',
      'NeRF with volumetric rendering',
      'Rays/samples visualization and spherical rendering'
    ]
  },
  '6': {
    id: '6',
    title: 'Project 5',
    title_des: 'Diffusion Models and Flow Matching',
    description: 'Diffusion-controlled editing in DeepFloyd IF followed by training MNIST flow-matching UNets from scratch.',
    longDescription: `Part A documents how I steer the pretrained DeepFloyd IF pipeline with custom prompts, iterative denoising, CFG, SDEdit, inpainting, visual anagrams, and hybrid image generation. Part B rewrites the UNet from low-level PyTorch modules, trains single-step denoisers, and scales into time-conditioned and class-conditioned flow matching models with full sampling diagnostics.`,
    folder: 'project5',
    image: 'prj5_thumbnail.png',
    images: [],
    thumbnailType: 'single',
    imageSets: [
      {
        name: 'Part A - Diffusion Sandbox with DeepFloyd IF',
        description: `Exploring classifier-free guided generation, SDEdit, and custom manipulations around the provided Campanile test image and additional sketches/web photos. Each deliverable is wired with placeholder asset slots so I can quickly drop in the exported JPG/MP4 evidence after rerunning the notebooks.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Part 0 - Some Images',
            description: '',
            images: [
              'parta/p0_sampling_1.png',
              'parta/p0_sampling_2.png',
              'parta/p0_sampling_3.png',
              'parta/p0_sampling_4.png',
              'parta/p0_sampling_5.png'
            ],
            captions: [
              'Prompt mix sample 1 (20 steps)',
              'Prompt mix sample 2 (40 steps)',
              'Prompt mix sample 3 (20 steps)',
              'Prompt mix sample 4 (40 steps)',
              'Prompt mix sample 5 (seed 42)'
            ],
            code: [
            ]
          },
          {
            name: 'Part 1.1 - Forward Process Sanity Check',
            description: '',
            images: [
              'parta/p1.7.2_originalcampanile_resized.png',
              'parta/p1.1campanile_noisy_250.jpg',
              'parta/p1.1campanile_noisy_500.jpg',
              'parta/p1.1campanile_noisy_750.jpg'
            ],
            captions: [
              'Reference Campanile crop (t = 0)',
              'Noise level t = 250',
              'Noise level t = 500',
              'Noise level t = 750'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'noisy_im = forward(im, t)',
                code:
`with no_grad:
  noise = randn_like(im)
  alpha_bar = alphas_cumprod[t]
  im_noisy = sqrt(alpha_bar) * im + sqrt(1 - alpha_bar) * noise
return im_noisy`
              }
            ]
          },
          {
            name: 'Part 1.2 - Classical Gaussian Denoising Baseline',
            description: '',
            images: [
              'parta/p1.1campanile_noisy_250.jpg',
              'parta/p1.2campanile_gauss_denoise_250.png',
              'parta/p1.1campanile_noisy_500.jpg',
              'parta/p1.2campanile_gauss_denoise_500.png',
              'parta/p1.1campanile_noisy_750.jpg',
              'parta/p1.2campanile_gauss_denoise_750.png'
            ],
            captions: [
              't = 250 noisy input',
              't = 250 best Gaussian blur (k=5)',
              't = 500 noisy input',
              't = 500 best Gaussian blur (k=7)',
              't = 750 noisy input',
              't = 750 best Gaussian blur (k=9)'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'Classical denoising sweep',
                code:
`for (t, kernel) in [(250, 5), (500, 7), (750, 9)]:
  noisy = forward(test_im, t)
  blurred = gaussian_blur(noisy, kernel_size=kernel, sigma=kernel//2)
  media.show_images([noisy, blurred])`
              }
            ]
          },
          {
            name: 'Part 1.3 - One-Step Diffusion Denoising',
            description: '',
            images: [
              'parta/p1.7.2_originalcampanile_resized.png',
              'parta/p1.1campanile_noisy_250.jpg',
              'parta/p1.3_denoise_250.png',
              'parta/p1.7.2_originalcampanile_resized.png',
              'parta/p1.1campanile_noisy_500.jpg',
              'parta/p1.3_denoise_500.png',
              'parta/p1.7.2_originalcampanile_resized.png',
              'parta/p1.1campanile_noisy_750.jpg',
              'parta/p1.3_denoise_750.png'
            ],
            captions: [
              't = 250 - clean reference',
              't = 250 - noisy sample',
              't = 250 - one-step UNet estimate',
              't = 500 - clean reference',
              't = 500 - noisy sample',
              't = 500 - one-step UNet estimate',
              't = 750 - clean reference',
              't = 750 - noisy sample',
              't = 750 - one-step UNet estimate'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'Removing predicted noise from a single timestep',
                code:
`prompt_embeds = prompt_embeds_dict['a high quality photo']
for t in [250, 500, 750]:
  x_t = forward(test_im, t)
  eps = stage_1.unet(x_t.half().cuda(), t, encoder_hidden_states=prompt_embeds.half())[0][:, :3].cpu()
  alpha_bar = alphas_cumprod[t]
  x0_hat = (x_t - sqrt(1 - alpha_bar) * eps) / sqrt(alpha_bar)
  store triplet (clean, x_t, x0_hat)`
              }
            ]
          },
          {
            name: 'Part 1.4 - Iterative Denoising and Comparisons',
            description: '',
            images: [
              'parta/p1.4_iterative_progress_strip.png',
              'parta/p1.4_iterative_progress_strip.png',
              'parta/p1.4_iterative_progress_strip.png',
              'parta/p1.4_iterative_progress_strip.png',
              'parta/p1.4_iterative_progress_strip.png',
              'parta/p1.4_iterative_final.png',
              'parta/p1.4_one_step.png',
              'parta/p1.4_gaussian_blur.png',
              'parta/p1.4_iterative_final.png'
            ],
            captions: [
              'Noisy seed at t=strided_timesteps[10]',
              'After 5 denoising steps',
              'After 10 denoising steps',
              'After 15 denoising steps',
              'After 20 denoising steps',
              'Final iterative reconstruction',
              'Iterative final vs one-step (one-step result)',
              'Iterative final vs Gaussian blur (blur result)',
              'Iterative final reference'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'Strided timestep schedule',
                code:
`strided_timesteps = list(range(990, -1, -30))
stage_1.scheduler.set_timesteps(strided_timesteps)`
              },
              {
                language: 'pseudo',
                description: 'iterative_denoise(im_noisy, i_start)',
                code:
`image = im_noisy
for i from i_start to len(timesteps) - 2:
  t = timesteps[i]; prev_t = timesteps[i+1]
  alpha_bar = alphas_cumprod[t]; alpha_bar_prev = alphas_cumprod[prev_t]
  alpha = alpha_bar / alpha_bar_prev; beta = 1 - alpha
  model_output = stage_1.unet(image, t, encoder_hidden_states=prompt_embeds)[0]
  noise_est, var_est = split_channels(model_output)
  x0 = (image - sqrt(1 - alpha_bar) * noise_est) / sqrt(alpha_bar)
  x0_coeff = sqrt(alpha_bar_prev) * beta / (1 - alpha_bar)
  xt_coeff = sqrt(alpha) * (1 - alpha_bar_prev) / (1 - alpha_bar)
  pred_prev = x0_coeff * x0 + xt_coeff * image
  image = add_variance(var_est, t, pred_prev)
  snapshot every 5 steps`
              }
            ]
          },
          {
            name: 'Part 1.5 - Sampling from Pure Noise',
            description: '',
            images: [
              'parta/p1.5_high_quality_sample_1.png',
              'parta/p1.5_high_quality_sample_2.png',
              'parta/p1.5_high_quality_sample_3.png',
              'parta/p1.5_high_quality_sample_4.png',
              'parta/p1.5_high_quality_sample_5.png'
            ],
            captions: [
              'Pure-noise sample 1',
              'Pure-noise sample 2',
              'Pure-noise sample 3',
              'Pure-noise sample 4',
              'Pure-noise sample 5'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'Loop over n_samples = 5',
                code:
`prompt_embeds = prompt_embeds_dict['a high quality photo']
for seed in range(5):
  im_noisy = torch.randn_like(test_im).half().cuda()
  sample = iterative_denoise(im_noisy, i_start=0, prompt_embeds=prompt_embeds, timesteps=strided_timesteps)
  collect sample`
              }
            ]
          },
          {
            name: 'Part 1.6 - Classifier-Free Guidance Sampling',
            description: '',
            images: [
              'parta/p1.6_cfg_1.png',
              'parta/p1.6_cfg_2.png',
              'parta/p1.6_cfg_3.png',
              'parta/p1.6_cfg_4.png',
              'parta/p1.6_cfg_5.png'
            ],
            captions: [
              'CFG sample 1 (scale 7)',
              'CFG sample 2 (scale 7)',
              'CFG sample 3 (scale 7)',
              'CFG sample 4 (scale 7)',
              'CFG sample 5 (scale 7)'
            ],
            code: [
              {
                language: 'pseudo',
                description: 'iterative_denoise_cfg',
                code:
`for each timestep:
  cond = stage_1.unet(image, t, encoder_hidden_states=prompt_embeds)[0]
  uncond = stage_1.unet(image, t, encoder_hidden_states=uncond_prompt_embeds)[0]
  noise_cond, var_est = split(cond); noise_uncond, _ = split(uncond)
  noise = noise_uncond + scale * (noise_cond - noise_uncond)
  propagate with same DDPM equations as iterative_denoise`
              }
            ]
          },
          {
            name: 'Part 1.7 - SDEdit on Campanile + Two Test Photos',
            description: '',
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'SDEdit driver',
                code:
`def process_pil_im(img):
  resize to 64x64, center-crop, normalize to [-1,1], add batch dim
for i_start in [1,3,5,7,10,20]:
  t = strided_timesteps[i_start]
  noisy = forward(processed_image, t)
  edited = iterative_denoise_cfg(noisy, i_start, prompt_embeds, uncond_prompt_embeds, strided_timesteps)`
              }
            ],
            subSections: [
              {
                name: 'Campanile reference',
                description: 'Campanile run conditioned on "a high quality photo".',
                images: [
                  'parta/p1.7.3_campanile_1.png',
                  'parta/p1.7.3_campanile_3.png',
                  'parta/p1.7.3_campanile_5.png',
                  'parta/p1.7.3_campanile_7.png',
                  'parta/p1.7.3_campanile_10.png',
                  'parta/p1.7.3_campanile_20.png'
                ],
                captions: [
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              },
              {
                name: 'Test Image A',
                description: 'First auxiliary photo processed with the exact same noise schedule.',
                images: ['parta/sahara.jpeg', 'parta/p1.7_desert_1.png', 'parta/p1.7_desert_3.png',
                   'parta/p1.7_desert_5.png', 'parta/p1.7_desert_7.png', 'parta/p1.7_desert_10.png', 'parta/p1.7_desert_20.png'],
                captions: [
                  'Original test image A',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              },
              {
                name: 'Test Image B',
                description: 'Second auxiliary photo following the same SDEdit recipe.',
                images: ['parta/man.jpeg', 'parta/p1.7_man_1.png', 
                  'parta/p1.7_man_3.png', 'parta/p1.7_man_5.png', 'parta/p1.7_man_7.png', 'parta/p1.7_man_10.png', 'parta/p1.7_man_20.png'],
                captions: [
                  'Original test image B',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              }
            ]
          },
          {
            name: 'Part 1.7.1 - Editing Web + Hand-Drawn Inputs',
            description: '',
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'Drawing ingestion + SDEdit loop',
                code:
`web_im = process_pil_im(Image.open('kjun.jpg'))
drawn_im = process_pil_im(draw('drawing.png'))
for source in [web_im, drawn_im1, drawn_im2]:
  for i_start in [1,3,5,7,10,20]:
    noisy = forward(source, strided_timesteps[i_start])
    edited = iterative_denoise_cfg(noisy, i_start, prompt_embeds, uncond_prompt_embeds, strided_timesteps)`
              }
            ],
            subSections: [
              {
                name: 'Web portrait',
                description: `Disclaimer: No political idea or any implication included. This image serves only for the purpose of the completion of the project. `,
                images: ['parta/kjun.jpg', 'parta/p1.7.1_web_1.png', 'parta/p1.7.1_web_3.png', 'parta/p1.7.1_web_5.png', 'parta/p1.7.1_web_7.png', 'parta/p1.7.1_web_10.png', 'parta/p1.7.1_web_20.png'],
                captions: [
                  'Original web photo',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              },
              {
                name: 'Hand-drawn sketch 1',
                description: 'Diffusion from first sketch',
                images: ['parta/kimjoungun_draw_1.jpg', 'parta/p1.7.1_draw_1_1.png', 'parta/p1.7.1_draw_1_3.png', 'parta/p1.7.1_draw_1_5.png', 'parta/p1.7.1_draw_1_7.png', 'parta/p1.7.1_draw_1_10.png', 'parta/p1.7.1_draw_1_20.png'], 
                captions: ['original sketch', 'i_start = 1', 'i_start = 3', 'i_start = 5', 'i_start = 7', 'i_start = 10', 'i_start = 20']
              },
              {
                name: 'Hand-drawn sketch 2',
                description: 'Diffusion from second sketch: wire frame',
                images: ['parta/kjun_draw_2.jpg', 'parta/p1.7.1_draw_2_1.png', 'parta/p1.7.1_draw_2_3.png', 'parta/p1.7.1_draw_2_5.png', 'parta/p1.7.1_draw_2_7.png', 'parta/p1.7.1_draw_2_10.png', 'parta/p1.7.1_draw_2_20.png'],
                captions: ['original sketch', 'i_start = 1', 'i_start = 3', 'i_start = 5', 'i_start = 7', 'i_start = 10', 'i_start = 20']
              }
            ]
          },
          {
            name: 'Part 1.7.2 - Inpainting Pipeline',
            description: '',
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'Inpainting loop',
                code:
`def inpaint(original, mask):
  image = randn_like(original); i_start = 0
  for i in range(len(timesteps)-1):
    t = timesteps[i]; prev_t = timesteps[i+1]
    compute alpha_bar, alpha_bar_prev, x0_coeff, xt_coeff as before
    cond = stage_1.unet(image, t, prompt_embeds)[0]
    uncond = stage_1.unet(image, t, uncond_prompt_embeds)[0]
    noise = uncond + scale * (cond - uncond)
    x0 = (image - sqrt(1 - alpha_bar) * noise) / sqrt(alpha_bar)
    pred_prev = x0_coeff * x0 + xt_coeff * image
    pred_prev = add_variance(pred_prev)
    image = mask * pred_prev + (1 - mask) * forward(original, prev_t)`
              }
            ],
            subSections: [
              {
                name: 'Campanile inpainting',
                description: 'Mask removes the top third so diffusion can hallucinate a replacement.',
                images: [
                  'parta/p1.7.2_originalcampanile_resized.png',
                  'parta/p1.7.2_mask.png',
                  'parta/p1.7.2inpainted.png'
                ],
                captions: ['Original Campanile', 'Binary mask', 'Inpainted tower top']
              },
              {
                name: 'Custom image 1',
                description: 'Change part of burger to a house.',
                images: ['parta/burger.jpeg', 'parta/p1.7.2_burger_mask.png', 'parta/p1.7.2_burger_out.png'],
                captions: ['Original image 1', 'Mask 1', 'Inpainted result 1']
              },
              {
                name: 'Custom image 2',
                description: 'Change the face of La Gioconda with a man.',
                images: ['parta/monalisa.jpeg', 'parta/p1.7.2_monalisa_mask.png', 'parta/p1.7.2_monalisa_out.png'],
                captions: ['Original image 2', 'Mask 2', 'Inpainted result 2']
              }
            ]
          },
          {
            name: 'Part 1.7.3 - Text-Conditional SDEdit',
            description: '',
            images: ['parta/p1.7.3_campanile_1.png', 'parta/p1.7.3_campanile_3.png', 'parta/p1.7.3_campanile_5.png',
              'parta/p1.7.3_campanile_7.png', 'parta/p1.7.3_campanile_10.png', 'parta/p1.7.3_campanile_20.png'],
            captions: ['i_start = 1', 'i_start = 3', 'i_start = 5', 'i_start = 7', 'i_start = 10', 'i_start = 20'],
            code: [
              {
                language: 'pseudo',
                description: 'Prompt-controlled edits',
                code:
`for prompt in custom_prompts:
  cond = prompt_embeds_dict[prompt]
  for i_start in [1,3,5,7,10,20]:
    noisy = forward(image, strided_timesteps[i_start])
    edited = iterative_denoise_cfg(noisy, i_start, cond, uncond_prompt_embeds, strided_timesteps)`
              }
            ],
            subSections: [
              {
                name: 'Campanile with custom prompt',
                description: 'Illustrates semantic drift as i_start grows.',
                images: [
                  'parta/p1.7.3_campanile_1.png',
                  'parta/p1.7.3_campanile_3.png',
                  'parta/p1.7.3_campanile_5.png',
                  'parta/p1.7.3_campanile_7.png',
                  'parta/p1.7.3_campanile_10.png',
                  'parta/p1.7.3_campanile_20.png'
                ],
                captions: [
                  'Original Campanile',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              },
              {
                name: 'Text-conditioned Image A',
                description: 'First auxiliary photo under a new textual target.',
                images: ['parta/sahara.jpeg', 'parta/p1.7.3_desert_1.png', 'parta/p1.7.3_desert_3.png', 'parta/p1.7.3_desert_5.png', 'parta/p1.7.3_desert_7.png', 'parta/p1.7.3_desert_10.png', 'parta/p1.7.3_desert_20.png'],
                captions: [
                  'Original image A',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              },
              {
                name: 'Text-conditioned Image B',
                description: 'Second auxiliary photo with matching schedule.',
                images: ['parta/man.jpeg', 'parta/p1.7.3_man_1.png', 'parta/p1.7.3_man_3.png', 
                  'parta/p1.7.3_man_5.png', 'parta/p1.7.3_man_7.png', 'parta/p1.7.3_man_10.png', 'parta/p1.7.3_man_20.png'],
                captions: [
                  'Original image B',
                  'i_start = 1',
                  'i_start = 3',
                  'i_start = 5',
                  'i_start = 7',
                  'i_start = 10',
                  'i_start = 20'
                ]
              }
            ]
          },
          {
            name: 'Part 1.8 - Visual Anagrams',
            description: '',
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'visual_anagrams pipeline',
                code:
`def make_flip_illusion(noise, prompt1, prompt2):
  for each timestep:
    epsilon1 = cfg_noise(image, prompt1)
    epsilon2 = vflip(cfg_noise(vflip(image), prompt2))
    noise_est = (epsilon1 + epsilon2) / 2
    propagate with DDPM update
  return final image`
              }
            ],
            subSections: [
              {
                description: 'Sea otter <-> squirrel illusion',
                name: '',
                images: [
                  'parta/p1.8seaotter_sequirrel.png',
                  'parta/p1.8seaotter_sequirrel_flipped.jpg'
                ],
                captions: ['Upright otter view', 'Flipped squirrel view']
              },
              {
                description: 'Angry cat <-> happy cat illusion',
                name: '',
                images: [
                  'parta/p1.8_angry_happy_cat.png',
                  'parta/p1.8_angry_happy_cat_flipped.jpg'
                ],
                captions: ['Upright angry cat', 'Flipped happy cat']
              }
            ]
          },
          {
            name: 'Part 1.9 - Hybrid Images (Factorized Diffusion)',
            description: '',
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'make_hybrids routine',
                code:
`epsilon1 = cfg_noise(image, prompt1)
epsilon2 = cfg_noise(image, prompt2)
epsilon1_lp = gaussian_blur(epsilon1, kernel_size=33, sigma=2)
epsilon2_hp = epsilon2 - gaussian_blur(epsilon2, kernel_size=33, sigma=2)
noise_est = epsilon1_lp + epsilon2_hp
propagate with DDPM update`
              }
            ],
            subSections: [
              {
                description: 'Volcano + cake hybrid',
                name: 'Volcano + cake hybrid',
                images: ['parta/p1.9_volcano_cake.png'],
                captions: ['Final hybrid image: volcano up close, cake from far away']
              },
              {
                description: 'Boat + airplane hybrid',
                name: 'Boat + airplane hybrid',
                images: ['parta/p1.9_boat_airplane.png'],
                captions: ['Hybrid image blending marine and aviation cues']
              }
            ]
          }
        ]
      },
      {
        name: 'Part B - Flow Matching and Conditional UNets',
        description: `Rebuilt the MNIST denoising UNet from primitive Conv/Down/Up blocks, trained single-step denoisers, and extended the model to time-conditioned and class-conditioned flow matching objectives with sampling diagnostics.`,
        images: [],
        captions: [],
        subSections: [
          {
            name: 'Part 1.1 - Implementing the UNet',
            description: `Detailed the Conv / DownConv / UpConv / Flatten / Unflatten modules, the skip connections, and the tensor shapes through the encoder-decoder path.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'Building block summary',
                code:
`Conv: 3x3 stride1 padding1 -> BatchNorm -> GELU
DownConv: 3x3 stride2 padding1
UpConv: ConvTranspose2d with kernel4 stride2 padding1
Flatten: AvgPool down to 1x1 latent
Unflatten: ConvTranspose2d kernel7 stride7 to restore 7x7 grid
ConvBlock: two Conv layers stacked
DownBlock: DownConv + ConvBlock
UpBlock: UpConv + ConvBlock`
              },
              {
                language: 'pseudo',
                description: 'Forward pass with skip connections',
                code:
`x1 = ConvBlock(in)
x2 = DownBlock(x1)
x3 = DownBlock(x2)
x4 = Flatten(x3)
x5 = Unflatten(x4)
x6 = UpBlock(concat(x5, x3))
x7 = UpBlock(concat(x6, x2))
x8 = ConvBlock(concat(x7, x1))
out = final 3x3 Conv2d projecting back to 1 channel`
              }
            ]
          },
          {
            name: 'Part 1.2.1 - Training Single-Step Denoiser',
            description: `Tracked the training loss across 5 epochs (batch size 256, lr 1e-4, noise sigma = 0.5) and saved denoising grids after epochs 1 and 5 (noisy input vs model output vs clean target).`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'Training loop skeleton',
                code:
`for epoch in range(num_epochs):
  for images, _ in train_loader:
    images = images.to(device)
    noise = torch.randn_like(images) * noise_level
    noisy = images + noise
    preds = model(noisy)
    loss = mse(preds, images)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
  record average epoch loss
  at epochs 1 and 5 -> run evaluation on test batch`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/train_p1.2.1.png'],
            captions: ['Training loss vs epoch (1 -> 5)'],
            code: []
          },
          {
            name:'',
            description: '',
            images: [         
              'partb/p1.2.1_epoch_1_5_comparison.png'
            ],
            captions: [              
              'Epoch 1 - noisy vs denoised grid'],
            code: []
          },
          {
            name: 'Part 1.2.2 - Out-of-Distribution sigma Sweep',
            description: `Held a single MNIST digit fixed and evaluated the trained denoiser for sigma values ranging from 0.0 to 1.0 to highlight failure modes outside the training noise distribution.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'OOD evaluation loop',
                code:
`test_image = fixed digit
for sigma in [0.0,0.2,0.4,0.5,0.6,0.8,1.0]:
  noisy = test_image + sigma * randn_like(test_image)
  denoised = model(noisy)
  stash triplet for visualization`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/p1.2.2.ood_all_sigmas.png'],
            captions: ['Grid: rows = {clean,noisy,denoised}, columns = sigma values {0.0 ... 1.0}'],
            code: []
          },
          {
            name: 'Part 1.2.3 - Denoising Pure Noise',
            description: `Trained a second UNet where the input is pure Gaussian noise and the label is a clean MNIST digit; logged the training loss curve and visualized outputs after epochs 1 and 5 to discuss centroid-like behavior.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'Pure-noise training tweaks',
                code:
`for images, _ in train_loader:
  noise = torch.randn_like(images) * noise_level
  preds = model_pure(noise)  # input is noise only
  loss = mse(preds, images)
  optimizer_pure.zero_grad(); loss.backward(); optimizer_pure.step()
save checkpoints at epochs 1 and 5 and visualize sampled outputs`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/train_p1.2.3.png'],
            captions: ['Pure-noise training loss vs epoch'],
            code: []
          },
          {
            name: '',
            description: '',
            images: [
              'partb/p1.2.3pure_noise_epoch1_2x5.png'
            ],
            captions: [
              'Epoch 1 - pure noise vs denoised outputs'
            ],
            code: []
          },
          {
            name:'',
            description: '',
            images: ['partb/p1.2.3pure_noise_epoch5_2x5.png'],
            captions: ['Epoch 5 - pure noise vs denoised outputs'],
            code: []
          },
          {
            name: 'Part 2.2 - Training Time-Conditioned Flow Matching',
            description: `Followed Algorithm B.1: sample x1 from MNIST, x0 from noise, interpolate x_t = (1 - t) x0 + t x1, train the UNet to predict the target flow (x1 - x0). Logged the loss curve over 10 epochs with batch size 64, lr 1e-2, and exponential LR scheduler.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'time_fm_forward',
                code:
`def time_fm_forward(unet, x1):
  x0 = randn_like(x1)
  t = torch.rand(N,1,1,1, device=x1.device)
  xt = (1 - t) * x0 + t * x1
  target = x1 - x0
  pred = unet(xt, t)
  return mse(pred, target)`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/train_p2.2.png'],
            captions: ['Time-conditioned flow matching training loss'],
            code: []
          },
          {
            name: 'Part 2.3 - Sampling from the Time-Conditioned UNet',
            description: `Loaded checkpoints from epochs 1, 5, and 10, then ran Algorithm B.2 to sample MNIST-like digits (15 samples per checkpoint) showing how structure emerges as training progresses.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'time_fm_sample',
                code:
`torch.manual_seed(seed)
x_t = randn(1,1,H,W)
for each t in torch.linspace(0,1,num_ts):
  flow = unet(x_t, t.view(1,1,1,1))
  x_t = x_t + (1/num_ts) * flow
return x_t`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/p2.3tcfm_epoch1_samples_3x5.png'],
            captions: ['Epoch 1 - 3x5 sample grid'],
            code: []
          },
          {
            name:'',
            description: '',
            images: [
              'partb/p2.3tcfm_epoch5_samples_3x5.png'
            ],
            captions: [
              'Epoch 5 - 3x5 sample grid'
            ],
            code: []
          },
          {
            name:'',
            description: '',
            images: [
              'partb/p2.3tcfm_epoch10_samples_3x5.png'
            ],
            captions: [
              'Epoch 10 - 3x5 sample grid'
            ],
            code: []
          },
          {
            name: 'Part 2.5 - Training the Class-Conditioned UNet',
            description: `Trained the class-conditional flow-matching model (batch size 64, lr 1e-2, num_ts = 50) with classifier-free dropout, logging the loss curve and saving checkpoints at epochs 1, 5, and 10.`,
            images: [],
            captions: [],
            code: [
              {
                language: 'pseudo',
                description: 'class_fm_forward',
                code:
`def class_fm_forward(unet, x1, labels):
  mask = (rand_like(labels.float()) > p_uncond).float()
  c = labels.float() * mask
  x0 = randn_like(x1)
  t = torch.rand(N,1,1,1)
  xt = (1 - t) * x0 + t * x1
  target = x1 - x0
  return mse(unet(xt, c, t), target)`
              }
            ]
          },
          {
            name: '',
            description: '',
            images: ['partb/train_p2.5.png'],
            captions: ['Class-conditioned flow matching loss vs epoch'],
            code: []
          },
          {
            name: 'Part 2.6 - Class-Conditioned Sampling + Scheduler Ablation',
            description: `Sampled 4 instances of each digit (0-9) after epochs 1/5/10 using classifier-free guidance scale 5, and ran an additional experiment where the exponential LR scheduler was removed-compensated by lowering the base LR and extending training-to show comparable quality. I removed the exponential learning-rate scheduler and replaced it with a single constant learning rate chosen to approximate the effective mid-training LR of the decayed schedule (from 1e-2 toward 1e-3 over 10 epochs). To preserve stability without LR decay, I used AdamW with a small weight decay and applied gradient clipping. This combination retained training stability and sample quality comparable to the scheduled run while keeping the training loop simpler.`,
            images: [],
            captions: [],
            code: [
            ]
          },
          {
            name:'',
            description: '',
            images: [
              'partb/p2.6_ns_sample_epc1.png'
            ],
            captions: [
              'No Scheduler - epoch 1 - digits 0-9 (4 samples each)'
            ],
            code: []  
          },
          {
            name:'',
            description: '',
            images: ['partb/p2.6_ns_sample_epc5.png'],
            captions: ['No Scheduler - epoch 5 - digits 0-9 (4 samples each)'],
            code: []
          },
          {
            name:'',
            description: '',
            images: ['partb/p2.6_ns_sample_epc10.png'],
            captions: ['No Scheduler - epoch 10 - digits 0-9 (4 samples each)'],
            code: []
          },
          {
            name:'',
            description: '',
            images: ['partb/train_p2.6_no_scheduler.png'],
            captions: ['No-scheduler training loss vs epoch'],
            code: []
          }
        ]
      }
    ],
    technologies: ['Diffusers', 'PyTorch', 'DeepFloyd IF', 'Classifier-Free Guidance', 'Flow Matching', 'MNIST'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/project5',
    features: [
      'Prompt-controlled DeepFloyd sampling and editing',
      'Iterative denoising with CFG, SDEdit, inpainting, and hybrid tricks',
      'From-scratch MNIST UNet denoisers',
      'Time- and class-conditioned flow matching with sampling diagnostics'
    ]
  }
}

// Export as array for Home component (easier to map over)
export const projectsArray = Object.values(projectsData)
