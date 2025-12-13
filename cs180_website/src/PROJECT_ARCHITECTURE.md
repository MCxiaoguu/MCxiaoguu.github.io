# Project Architecture Documentation

## Overview

The project system now supports both custom project pages and a fallback template system. This allows maximum flexibility for future projects while maintaining consistency.

## Architecture

### Base Components

#### `BaseProject.tsx`
- Main wrapper component that provides the common layout (header, navigation, footer)
- Handles the back button and project title
- Accepts children for custom content

#### `ProjectImageGrid.tsx`
- Reusable component for displaying project images in a grid
- Handles image loading errors with fallback
- Responsive grid layout

#### `ProjectSidebar.tsx`
- Reusable component for displaying technologies and features
- Consistent styling across all projects

#### `ProjectTemplate.tsx`
- Default template for projects that don't need custom layouts
- Uses all the base components in a standard layout
- Good for simple projects

### Project Pages

#### `Project1.tsx`
- Custom page for Project 1 (Camera & Focal Length project)
- Inherits from `BaseProject` but adds custom sections
- Example of how to create project-specific content

#### `Project.tsx` (Router)
- Main router component that decides which project page to render
- Routes specific project IDs to custom pages
- Falls back to `ProjectTemplate` for projects without custom pages

## Adding New Projects

### Option 1: Simple Project (Uses Template)
1. Add project data to `src/data/projects.ts`
2. That's it! The router will automatically use `ProjectTemplate`

### Option 2: Custom Project Page
1. Add project data to `src/data/projects.ts`
2. Create a new file: `src/pages/ProjectX.tsx` (replace X with project number)
3. Follow the pattern from `Project1.tsx`:

```tsx
import React from 'react'
import { BaseProject, ProjectImageGrid, ProjectSidebar } from '../components/BaseProject'
import { projectsData, getImageUrl } from '../data/projects'

interface ProjectXProps {
  isDark: boolean
  toggleTheme: () => void
}

const ProjectX: React.FC<ProjectXProps> = ({ isDark, toggleTheme }) => {
  const project = projectsData['X'] // Replace X with project ID

  return (
    <BaseProject 
      isDark={isDark} 
      toggleTheme={toggleTheme} 
      title={project.title}
    >
      {/* Your custom content here */}
      
      {/* Use common components */}
      <ProjectImageGrid 
        images={project.images}
        folder={project.folder}
        title={project.title}
        getImageUrl={getImageUrl}
      />
      
      {/* More custom content */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        <div className="lg:col-span-2">
          {/* Custom description content */}
        </div>
        <ProjectSidebar 
          technologies={project.technologies}
          features={project.features}
        />
      </div>
    </BaseProject>
  )
}

export default ProjectX
```

4. Add the route in `src/pages/Project.tsx`:

```tsx
case 'X':
  return <ProjectX isDark={isDark} toggleTheme={toggleTheme} />
```

## Benefits

1. **Flexibility**: Each project can have completely custom layouts
2. **Consistency**: Common components ensure consistent styling
3. **Maintainability**: Shared code in base components
4. **Scalability**: Easy to add new projects
5. **Fallback**: Projects without custom pages still work perfectly

## File Structure

```
src/
├── components/
│   ├── BaseProject.tsx       # Base layout component
│   ├── ProjectTemplate.tsx   # Default template
│   └── ...other components
├── pages/
│   ├── Project.tsx          # Router component
│   ├── Project1.tsx         # Custom page for project 1
│   ├── Project2.tsx         # Custom page for project 2 (future)
│   └── ...
└── data/
    └── projects.ts          # Project data
```

This architecture gives you the best of both worlds: quick setup for simple projects and complete customization freedom for complex ones!
