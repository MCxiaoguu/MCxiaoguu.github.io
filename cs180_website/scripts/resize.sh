#!/bin/bash

# CS180 Project Image & Video Optimization Script
# Usage: ./resize.sh --project 1

# Function to display usage
usage() {
    echo "Usage: $0 --project <project_number>"
    echo "Example: $0 --project 1"
    exit 1
}

# Function to check if required tools are installed
check_dependencies() {
    local missing_tools=()
    
    # Check for ImageMagick
    if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
        missing_tools+=("imagemagick")
    fi
    
    # Check for FFmpeg (for video compression)
    if ! command -v ffmpeg &> /dev/null; then
        missing_tools+=("ffmpeg")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo "Missing required tools: ${missing_tools[*]}"
        echo "Installing missing dependencies..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS with Homebrew
            for tool in "${missing_tools[@]}"; do
                echo "Installing $tool..."
                brew install "$tool"
            done
        else
            # Linux with apt
            sudo apt-get update
            for tool in "${missing_tools[@]}"; do
                echo "Installing $tool..."
                sudo apt-get install -y "$tool"
            done
        fi
    fi
}

# Function to get file size in KB
get_file_size() {
    local file="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$file" 2>/dev/null | awk '{print int($1/1024)}'
    else
        stat -c%s "$file" 2>/dev/null | awk '{print int($1/1024)}'
    fi
}

# Function to optimize images
optimize_images() {
    local project_dir="$1"
    local backup_dir="$2"
    
    echo "Optimizing images in $project_dir..."
    
    # Find all image files
    find "$project_dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.tiff" -o -iname "*.bmp" \) | while read -r image; do
        local filename=$(basename "$image")
        local backup_path="$backup_dir/$filename"
        
        echo "Processing: $filename"
        
        # Check image dimensions to see if it needs optimization
        local dimensions=""
        if command -v magick &> /dev/null; then
            dimensions=$(magick identify -format "%wx%h" "$image" 2>/dev/null)
        else
            dimensions=$(identify -format "%wx%h" "$image" 2>/dev/null)
        fi
        
        if [ -n "$dimensions" ]; then
            local width=$(echo "$dimensions" | cut -d'x' -f1)
            local height=$(echo "$dimensions" | cut -d'x' -f2)
            local max_dimension=$((width > height ? width : height))
            
            # Skip if image is already small enough (800px or less)
            if [ "$max_dimension" -le 800 ]; then
                echo "  Skipping $filename (already optimized: ${dimensions})"
                continue
            fi
            echo "  Current size: ${dimensions}, needs optimization"
        fi
        
        # Get original file size
        local original_size=$(get_file_size "$image")
        
        # Backup original if not already backed up
        if [ ! -f "$backup_path" ]; then
            cp "$image" "$backup_path"
            echo "  Backed up to: $backup_path"
        else
            echo "  Using existing backup: $backup_path"
        fi
        
        # Optimize the image: resize to 800x800 max, 75% quality, keep as JPG
        local temp_path="${image}.tmp"
        
        # Create optimized version using temporary file approach (like working script)
        local magick_success=false
        if command -v magick &> /dev/null; then
            if magick "$image" -resize '800x800>' -quality 75 -strip "$temp_path"; then
                magick_success=true
            fi
        else
            if convert "$image" -resize '800x800>' -quality 75 -strip "$temp_path"; then
                magick_success=true
            fi
        fi
        
        if [ "$magick_success" = true ] && [ -f "$temp_path" ]; then
            # Replace original with optimized (same filename, just optimized)
            mv "$temp_path" "$image"
            echo "  Optimized $filename"
        else
            echo "  Error: Failed to optimize $filename, keeping original"
            rm -f "$temp_path" 2>/dev/null
            continue
        fi
        
        # Get new size (using the current image path)
        local new_size=$(get_file_size "$image")
        local savings=$((original_size - new_size))
        local percent=0
        if [ "$original_size" -gt 0 ]; then
            percent=$((savings * 100 / original_size))
        fi
        
        echo "  Size: ${original_size}KB -> ${new_size}KB (${percent}% reduction)"
        
        # Check if target size is achieved (100-200KB)
        if [ "$new_size" -gt 200 ]; then
            echo "  Warning: File still larger than 200KB, applying additional compression..."
            local temp_path2="${image}.tmp2"
            if command -v magick &> /dev/null; then
                magick "$image" -quality 60 "$temp_path2"
            else
                convert "$image" -quality 60 "$temp_path2"
            fi
            if [ -f "$temp_path2" ]; then
                mv "$temp_path2" "$image"
                new_size=$(get_file_size "$image")
                echo "  Final size: ${new_size}KB"
            fi
        fi
    done
}

# Function to compress videos
compress_videos() {
    local project_dir="$1"
    local backup_dir="$2"
    
    echo "Compressing videos in $project_dir..."
    
    # Find all video files
    find "$project_dir" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.webm" \) | while read -r video; do
        local filename=$(basename "$video")
        local backup_path="$backup_dir/$filename"
        
        echo "Processing video: $filename"
        
        # Check video resolution to see if it needs compression
        local video_info=""
        if command -v ffprobe &> /dev/null; then
            video_info=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$video" 2>/dev/null)
        fi
        
        if [ -n "$video_info" ]; then
            local width=$(echo "$video_info" | cut -d',' -f1)
            local height=$(echo "$video_info" | cut -d',' -f2)
            local max_dimension=$((width > height ? width : height))
            
            # Skip if video is already small enough (1280px or less)
            if [ "$max_dimension" -le 1280 ]; then
                echo "  Skipping $filename (already optimized: ${width}x${height})"
                continue
            fi
            echo "  Current resolution: ${width}x${height}, needs compression"
        fi
        
        # Get original file size
        local original_size=$(get_file_size "$video")
        
        # Backup original if not already backed up
        if [ ! -f "$backup_path" ]; then
            cp "$video" "$backup_path"
            echo "  Backed up to: $backup_path"
        else
            echo "  Using existing backup: $backup_path"
        fi
        
        # Compress video for web use
        local compressed_name="${filename%.*}_compressed.mp4"
        local compressed_path="$project_dir/$compressed_name"
        
        # Use FFmpeg to compress: scale to max 1280x720, reasonable bitrate for web (quiet mode)
        echo "  Compressing video..."
        if ffmpeg -loglevel error -i "$video" -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -y "$compressed_path" 2>/dev/null; then
            # Only remove original if compression succeeded
            if [ -f "$compressed_path" ]; then
                rm "$video"
                # Rename compressed to original name (without _compressed suffix)
                mv "$compressed_path" "$project_dir/${filename%.*}.mp4"
                echo "  Successfully compressed $filename"
            else
                echo "  Error: Compressed file not created, keeping original"
                continue
            fi
        else
            echo "  Error: FFmpeg failed to compress $filename, keeping original"
            rm -f "$compressed_path" 2>/dev/null  # Clean up any partial file
            continue
        fi
        
        # Get new size
        local new_size=$(get_file_size "$project_dir/${filename%.*}.mp4")
        local savings=$((original_size - new_size))
        local percent=0
        if [ "$original_size" -gt 0 ]; then
            percent=$((savings * 100 / original_size))
        fi
        
        echo "  Size: ${original_size}KB -> ${new_size}KB (${percent}% reduction)"
    done
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    usage
fi

PROJECT_NUM=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT_NUM="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate project number
if [ -z "$PROJECT_NUM" ]; then
    echo "Error: Project number is required"
    usage
fi

if ! [[ "$PROJECT_NUM" =~ ^[0-9]+$ ]]; then
    echo "Error: Project number must be a positive integer"
    exit 1
fi

# Set up paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$PROJECT_ROOT/public/images/project$PROJECT_NUM"
BACKUP_DIR="$PROJECT_ROOT/backup/project$PROJECT_NUM"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory '$PROJECT_DIR' does not exist"
    exit 1
fi

echo "CS180 Project $PROJECT_NUM Image & Video Optimization"
echo "=============================================="
echo "Project directory: $PROJECT_DIR"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Check dependencies
check_dependencies

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get initial sizes
echo "Initial analysis:"
if [ -d "$PROJECT_DIR" ]; then
    echo "  Project folder: $(du -sh "$PROJECT_DIR" | cut -f1)"
    
    # Count files
    image_count=$(find "$PROJECT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.tiff" -o -iname "*.bmp" \) | wc -l)
    video_count=$(find "$PROJECT_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.avi" -o -iname "*.mkv" -o -iname "*.webm" \) | wc -l)
    
    echo "  Images found: $image_count"
    echo "  Videos found: $video_count"
fi
echo ""

# Optimize images
if [ "$image_count" -gt 0 ]; then
    optimize_images "$PROJECT_DIR" "$BACKUP_DIR"
    echo ""
fi

# Compress videos
if [ "$video_count" -gt 0 ]; then
    compress_videos "$PROJECT_DIR" "$BACKUP_DIR"
    echo ""
fi

# Final report
echo "Optimization complete!"
echo "====================="
echo "Final project folder: $(du -sh "$PROJECT_DIR" | cut -f1)"
echo "Backup folder: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo ""
echo "Original files have been backed up to: $BACKUP_DIR"
echo "Optimized files are ready for web deployment!"
