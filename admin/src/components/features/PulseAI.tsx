'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { soundEngine } from '@/utils/admin.sound'
import { MessageSquare, X, Send, ChevronDown, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/apiClient'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function PulseAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      if (next) soundEngine.play('switch')
      return next
    })
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return
    soundEngine.play('click')

    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setThinking(true)
    soundEngine.play('thinking')

    try {
      const response = await apiClient.post('/ai/chat', { query: currentInput })
      const reply = response.data?.data?.response || 'No response received.'
      setThinking(false)
      soundEngine.play('success')
      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setThinking(false)
      console.error('PulseAI error:', err)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">PulseAI</h3>
                <p className="text-xs text-slate-500">Command Center Co-pilot</p>
              </div>
            </div>
            <button onClick={toggleOpen} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[360px]">
            {messages.length === 0 && !thinking && (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 flex items-center justify-center">
                  <MessageSquare size={24} className="text-cyan-500" />
                </div>
                <p className="text-sm text-slate-500">Ask me anything about your dashboard</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Why is Ngong Rd occupancy cooling?',
                    'Safety report for Westlands',
                    'Show fraud patterns',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion)
                        soundEngine.play('switch')
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 hover:border-cyan-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-br-md'
                      : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-md'
                  )}
                >
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1.5' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                  <Loader2 size={16} className="text-cyan-500 animate-spin" />
                  <span className="text-sm text-slate-500">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask PulseAI..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                disabled={thinking}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || thinking}
                className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className={cn(
          'group relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300',
          open
            ? 'bg-slate-800 shadow-lg'
            : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 shadow-lg hover:shadow-xl hover:scale-105'
        )}
      >
        {open ? (
          <>
            <ChevronDown size={16} />
            <span>Close</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span>PulseAI</span>
          </>
        )}
        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white pulse-glow" />}
      </button>
    </div>
  )
}
