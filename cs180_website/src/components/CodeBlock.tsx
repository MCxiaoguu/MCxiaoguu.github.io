import React, { useState } from 'react'

export interface CodeSnippet {
  language: string
  code: string
  filename?: string
  description?: string
}

interface CodeBlockProps {
  snippets: CodeSnippet[]
  className?: string
  layout?: 'tabs' | 'side-by-side'
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  snippets, 
  className = '', 
  layout = snippets.length === 2 ? 'side-by-side' : 'tabs' 
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      python: 'bg-blue-500',
      javascript: 'bg-amber-500',
      typescript: 'bg-blue-600',
      html: 'bg-orange-500',
      css: 'bg-blue-400',
      bash: 'bg-slate-600',
      json: 'bg-indigo-500',
      markdown: 'bg-slate-500'
    }
    return colors[language.toLowerCase()] || 'bg-slate-500'
  }

  if (snippets.length === 0) return null

  // Single code block component
  const SingleCodeBlock: React.FC<{ 
    snippet: CodeSnippet; 
    index: number; 
    className?: string;
  }> = ({ snippet, index, className: blockClassName = '' }) => (
    <div className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 
                    rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm 
                    overflow-hidden w-full flex flex-col ${blockClassName}`}>
      {/* Header */}
      <div className="bg-white/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 
                      px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(snippet.language)}`} />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {snippet.filename || `code.py`}
          </span>
        </div>
        
        <button
          onClick={() => copyToClipboard(snippet.code, index)}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 
                     hover:text-slate-800 dark:hover:text-slate-200 
                     bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700
                     border border-slate-200 dark:border-slate-600 rounded-lg 
                     transition-colors duration-200"
        >
          {copiedIndex === index ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Description */}
      {snippet.description && (
        <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 
                        bg-blue-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          {snippet.description}
        </div>
      )}

      {/* Code Content */}
      <div className="relative flex-1">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed h-full">
          <code className="text-slate-800 dark:text-slate-200 font-mono">
            {snippet.code}
          </code>
        </pre>
      </div>
    </div>
  )

  // Side-by-side layout for comparison
  if (layout === 'side-by-side' && snippets.length === 2) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 w-full ${className}`}>
        <SingleCodeBlock snippet={snippets[0]} index={0} className="h-full" />
        <SingleCodeBlock snippet={snippets[1]} index={1} className="h-full" />
      </div>
    )
  }

  // Tab layout for multiple snippets or single snippet
  return (
    <div className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 
                    rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm 
                    overflow-hidden w-full ${className}`}>
      {/* Tab Headers */}
      {snippets.length > 1 && (
        <div className="bg-white/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex overflow-x-auto">
            {snippets.map((snippet, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === index
                    ? 'text-slate-800 dark:text-white bg-white dark:bg-slate-700 border-b-2 border-blue-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getLanguageColor(snippet.language)}`} />
                  <span>{snippet.filename || 'code.py'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Code Content */}
      <SingleCodeBlock 
        snippet={snippets[activeTab]} 
        index={activeTab} 
        className="border-0 rounded-none shadow-none bg-transparent"
      />
    </div>
  )
}

export default CodeBlock