'use client'

import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

const initialImages = [
  { id: '1', name: 'living-room.jpg', size: '1.2 MB' },
  { id: '2', name: 'bedroom-1.jpg', size: '890 KB' },
  { id: '3', name: 'kitchen.jpg', size: '1.1 MB' },
]

export default function PropertyImagesManager() {
  const [images, setImages] = useState(initialImages)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-700">Property Images</p>
        <span className="text-xs text-slate-400">{images.length} uploaded</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative group border border-slate-200 rounded-lg p-3">
            <div className="h-20 rounded-md bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
              <ImagePlus size={24} className="text-primary" />
            </div>
            <p className="text-xs font-medium text-slate-700 mt-2 truncate">{image.name}</p>
            <p className="text-[10px] text-slate-400">{image.size}</p>
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((img) => img.id !== image.id))}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 shadow-sm"
              aria-label={`Remove ${image.name}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors min-h-[120px]">
          <ImagePlus size={20} className="text-slate-400 mb-1" />
          <span className="text-xs text-slate-500">Add Image</span>
          <input type="file" accept="image/*" multiple className="hidden" />
        </label>
      </div>
    </div>
  )
}