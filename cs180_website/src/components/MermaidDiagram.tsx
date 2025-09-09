import React from 'react'
// @ts-ignore
import Mermaid from 'react-mermaid2'

interface MermaidDiagramProps {
  chart: string
  isDark?: boolean
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, isDark = false }) => {
  const config = {
    startOnLoad: true,
    theme: isDark ? 'dark' : 'default',
    themeVariables: {
      primaryColor: isDark ? '#374151' : '#f3f4f6',
      primaryTextColor: isDark ? '#e5e5e5' : '#222',
      primaryBorderColor: isDark ? '#6b7280' : '#d1d5db',
      lineColor: isDark ? '#9ca3af' : '#6b7280',
      secondaryColor: isDark ? '#4b5563' : '#e5e7eb',
      tertiaryColor: isDark ? '#1f2937' : '#ffffff',
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    }
  }

  return (
    <div className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
      <Mermaid chart={chart} config={config} />
    </div>
  )
}

export default MermaidDiagram
