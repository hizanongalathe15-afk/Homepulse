'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  ExternalLink,
  Calendar,
  MoreVertical,
  ChevronDown,
  Filter,
} from 'lucide-react'
import {
  CONVERSATIONS,
  MESSAGES,
  PROPERTIES,
  formatKES,
  type Conversation,
  type Message,
} from '@/lib/homespot.data'

const NEGOTIATION_MESSAGES: Message[] = [
  { id: '8', sender: 'me', text: 'Would you be open to KES 80,000/month for a 12-month lease?', time: '10:16 AM', read: true },
  { id: '9', sender: 'them', text: "Hmm, 80K is a bit low. The apartment is in a prime location with all amenities included.", time: '10:18 AM' },
  { id: '10', sender: 'them', text: 'Best I can do is KES 82,000/month, and I can throw in one month free parking.', time: '10:19 AM' },
  { id: '11', sender: 'me', text: 'KES 82,000 with free parking sounds fair. Deal! 👍', time: '10:21 AM', read: true },
  { id: '12', sender: 'them', text: 'Excellent! Looking forward to meeting you tomorrow at 11 AM. I\'ll have the lease agreement ready for review.', time: '10:22 AM' },
]

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState<string>('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([...MESSAGES, ...NEGOTIATION_MESSAGES])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = CONVERSATIONS.find(c => c.id === activeConvId) ?? CONVERSATIONS[0]
  const linkedProperty = PROPERTIES.find(p => p.title.includes(activeConv.property.title)) ?? PROPERTIES[0]

  const filteredConvos = CONVERSATIONS.filter(c => {
    const q = searchQuery.toLowerCase()
    return (
      c.user.name.toLowerCase().includes(q) ||
      c.property.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    )
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!inputText.trim()) return
    const newMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      read: true,
    }
    setMessages(prev => [...prev, newMsg])
    setInputText('')

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = {
        id: `t-${Date.now()}`,
        sender: 'them',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        text: "Thanks for the message! I'll get back to you shortly.",
      }
      setMessages(prev => [...prev, reply])
    }, 1800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-mesh p-4 md:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 text-sm mt-1">Manage conversations with landlords and tenants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-10rem)] min-h-[640px]">
        {/* LEFT COLUMN - Conversations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 glass rounded-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/60 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Inbox</h2>
              <button className="glass-subtle p-2 rounded-xl text-slate-600 hover:text-indigo-600 transition">
                <Filter size={16} />
              </button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="hs-input w-full pl-10 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConvos.map((conv, idx) => {
              const isActive = conv.id === activeConvId
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-400/30 shadow-sm'
                      : 'hover:bg-white/60 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.user.avatar}
                        alt={conv.user.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                      {conv.user.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full pulse-dot" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`font-semibold text-sm truncate ${isActive ? 'text-indigo-700' : 'text-slate-900'}`}>
                          {conv.user.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
                          {conv.lastTime} ago
                        </span>
                      </div>
                      <div className="text-xs font-medium text-indigo-600 truncate mb-1">
                        {conv.property.title}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-indigo-500/25">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* MIDDLE COLUMN - Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 glass rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.user.avatar}
                  alt={activeConv.user.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-md"
                />
                {activeConv.user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full pulse-dot" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 leading-tight">{activeConv.user.name}</h3>
                <div className="flex items-center gap-1.5">
                  {activeConv.user.online ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Online</span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">Last seen {activeConv.user.lastSeen}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="glass-subtle p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition">
                <Phone size={18} />
              </button>
              <button className="glass-subtle p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition">
                <Video size={18} />
              </button>
              <button className="glass-subtle p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-transparent via-indigo-50/30 to-violet-50/20">
            <div className="flex items-center justify-center my-2">
              <span className="glass-subtle px-3 py-1 rounded-full text-[11px] text-slate-500 font-medium">
                Today
              </span>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isSent = msg.sender === 'me'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-end gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isSent && (
                      <img
                        src={activeConv.user.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0 mb-0.5"
                      />
                    )}
                    <div className={`flex flex-col gap-1 max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
                      <div className={isSent ? 'msg-bubble-sent' : 'msg-bubble-received'}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${isSent ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                        {isSent && msg.read && (
                          <CheckCircle2 size={12} className="text-indigo-500" />
                        )}
                      </div>
                    </div>
                    {isSent && (
                      <div className="w-7 h-7 flex-shrink-0" />
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <img
                  src={activeConv.user.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0 mb-0.5"
                />
                <div className="msg-bubble-received py-3">
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-slate-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-slate-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-slate-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/60 dark:border-white/10">
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="glass-subtle p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition">
                  <Paperclip size={18} />
                </button>
                <button className="glass-subtle p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition">
                  <Smile size={18} />
                </button>
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Type a message..."
                  className="hs-input w-full resize-none min-h-[48px] max-h-32 pr-12 py-3 text-sm"
                  style={{ overflowY: 'auto' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="flex-shrink-0 p-3 rounded-xl btn-gradient disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Property Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 glass rounded-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Property Details</h2>
            <button className="glass-subtle p-2 rounded-xl text-slate-600 hover:text-indigo-600 transition">
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Property Image Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="img-wrap w-full aspect-[4/3] rounded-2xl shadow-lg"
            >
              <img
                src={linkedProperty.images[0]}
                alt={linkedProperty.title}
                className="w-full h-full object-cover"
              />
              {linkedProperty.verified && (
                <div className="absolute top-3 left-3 badge-verified">
                  <CheckCircle2 size={12} />
                  Verified
                </div>
              )}
            </motion.div>

            {/* Title & Location */}
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-snug mb-1.5">
                {linkedProperty.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
                <span>{linkedProperty.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="glass-subtle p-4 rounded-2xl">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gradient">
                  {formatKES(linkedProperty.price)}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  /{linkedProperty.period}
                </span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="glass-subtle p-3 rounded-xl text-center">
                <BedDouble size={16} className="mx-auto text-indigo-500 mb-1" />
                <div className="font-semibold text-sm text-slate-900">{linkedProperty.bedrooms || 'Studio'}</div>
                <div className="text-[10px] text-slate-400 font-medium">BR</div>
              </div>
              <div className="glass-subtle p-3 rounded-xl text-center">
                <Bath size={16} className="mx-auto text-indigo-500 mb-1" />
                <div className="font-semibold text-sm text-slate-900">{linkedProperty.bathrooms}</div>
                <div className="text-[10px] text-slate-400 font-medium">BA</div>
              </div>
              <div className="glass-subtle p-3 rounded-xl text-center">
                <Maximize2 size={16} className="mx-auto text-indigo-500 mb-1" />
                <div className="font-semibold text-sm text-slate-900">{linkedProperty.area}</div>
                <div className="text-[10px] text-slate-400 font-medium">SqFt</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {linkedProperty.tags.map(tag => (
                <span key={tag} className="badge-tag">{tag}</span>
              ))}
            </div>

            {/* Landlord info */}
            <div className="glass-subtle p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={linkedProperty.landlord.avatar}
                  alt={linkedProperty.landlord.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900">{linkedProperty.landlord.name}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {linkedProperty.landlord.verified && <CheckCircle2 size={11} className="text-emerald-500" />}
                    <span>{linkedProperty.landlord.properties} properties · {linkedProperty.landlord.responseTime}</span>
                  </div>
                </div>
              </div>
              <div className="divider-gradient mb-3" />
              <p className="text-xs text-slate-600 leading-relaxed">
                {linkedProperty.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button className="w-full py-3 rounded-xl glass-subtle font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-indigo-100 transition-all flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                View Property
              </button>
              <button className="w-full py-3.5 rounded-xl btn-gradient flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                <Calendar size={16} />
                Schedule Viewing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
