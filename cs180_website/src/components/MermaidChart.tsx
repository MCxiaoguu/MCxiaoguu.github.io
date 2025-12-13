import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidChartProps {
  chart: string
  isDark?: boolean
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, isDark = false }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Initialize mermaid with theme based on dark mode
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default'
      })

      // Clear previous content
      ref.current.innerHTML = ''

      // Render the chart
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      try {
        const svgCode = mermaid.render(id, chart)
        if (ref.current && typeof svgCode === 'string') {
          ref.current.innerHTML = svgCode
        }
      } catch (error: any) {
        console.error('Mermaid rendering error:', error)
        if (ref.current) {
          ref.current.innerHTML = '<p class="text-red-500">Error rendering diagram</p>'
        }
      }
    }
  }, [chart, isDark])

  return (
    <div 
      ref={ref} 
      className="flex justify-center items-center w-full overflow-x-auto py-4"
      style={{ minHeight: '300px' }}
    />
  )
}

export default MermaidChart
