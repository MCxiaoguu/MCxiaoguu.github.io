# CS180 Image Optimization Scripts

This directory contains scripts for optimizing images and videos for the CS180 website.

## Scripts

### resize.sh
Optimizes images and videos for specific project folders.

**Usage:**
```bash
./resize.sh --project <project_number>
```

**Example:**
```bash
./resize.sh --project 1
```

**What it does:**
1. **Backup:** Moves original images and videos to `/backup/project#/` for safekeeping
2. **Image Optimization:** 
   - Resizes images to maximum 800x800 pixels
   - Converts to JPG format with 75% quality
   - Targets file sizes of 100-200KB for fast web loading
   - Applies additional compression if files are still too large
3. **Video Compression:**
   - Scales videos to maximum 1280x720 resolution
   - Uses H.264 encoding with optimized settings for web
   - Significantly reduces file sizes while maintaining good quality

**Dependencies:**
- ImageMagick (for image processing)
- FFmpeg (for video compression)

The script will automatically install missing dependencies on macOS (via Homebrew) or Linux (via apt).

**Safety:**
- All original files are backed up before optimization
- Backup folders are excluded from git via `.gitignore`
- The script can be run multiple times safely (skips already processed files)

### optimize_images.sh
Legacy script for gallery optimization (creates thumbnails and optimizes full-size images).

## File Structure

After running the resize script, your project structure will look like:

```
backup/
  project1/          # Original files backed up here
    original_image.jpg
    original_video.mp4
public/
  images/
    project1/        # Optimized files for web
      optimized_image.jpg  (800x800 max, ~100-200KB)
      optimized_video.mp4  (1280x720 max, web-optimized)
```

## Tips

- Run the script whenever you add new images/videos to a project folder
- The backup ensures you never lose original quality files
- Optimized files provide much faster loading times for website visitors
- You can always restore from backup if needed
