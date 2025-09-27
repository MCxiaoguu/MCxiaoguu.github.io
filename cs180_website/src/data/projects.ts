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
- **Scale control:** σ parameter controls both smoothing and derivative scale

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
- **σ:** Controls which frequencies are enhanced`,
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
            captions: ["Original sharp image (α=5)", "Sharpen After Gaussian blur (σ=5)", "Sharpen After Gaussian blur (σ=20)"]
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
- **σ₁ (low-pass cutoff):** Controls which frequencies from Image₁ to retain
- **σ₂ (high-pass cutoff):** Controls which frequencies from Image₂ to retain  
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
        description: `Here are two set of pictures I've blended using the multi-resolution blending technique. The first set is a blend between a cat and a dog, while the second set is a blend between Yuhua and a dog/cat.`,
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
}

// Export as array for Home component (easier to map over)
export const projectsArray = Object.values(projectsData)
