'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'

export default function FeedbackResponse() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AdminButton onClick={() => setOpen(true)}>Reply</AdminButton>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Reply to Feedback</h3>
              <p className="mt-1 text-sm text-slate-500">Send a response to the selected feedback entry.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Response</label>
                <textarea
                  className="admin-input w-full h-32 resize-none"
                  placeholder="Write your reply..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <AdminButton variant="secondary" onClick={() => setOpen(false)}>Cancel</AdminButton>
              <AdminButton onClick={() => setOpen(false)}>Send Reply</AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
