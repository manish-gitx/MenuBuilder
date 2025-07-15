import React from 'react'
import { MenuItem } from '@/lib/api'
import { PencilIcon, CameraIcon, TrashIcon } from '@heroicons/react/24/outline'

interface MenuItemCardProps {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onImageUpload?: (item: MenuItem) => void
}

export function MenuItemCard({ item, onEdit, onDelete, onImageUpload }: MenuItemCardProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex gap-4 items-center">
      {/* Left side - vegetarian indicator and name */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Vegetarian indicator - green circle */}
        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
        
        {/* Item name */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-lg leading-tight truncate">
            {item.name}
          </h3>
        </div>
      </div>

      {/* Right side - image and edit button */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        {/* Image placeholder - smaller and rectangular */}
        <div className="w-24 h-16 bg-zinc-700 rounded-lg flex flex-col items-center justify-center relative group">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <CameraIcon className="w-5 h-5 text-zinc-500 mb-1" />
              <span className="text-zinc-500 text-xs text-center leading-none">Add photo</span>
            </>
          )}
          
          {/* Upload overlay on hover */}
          {onImageUpload && (
            <button
              onClick={() => onImageUpload(item)}
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CameraIcon className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1 px-3 py-1 text-white hover:bg-zinc-700 rounded transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex items-center gap-1 px-3 py-1 text-red-400 hover:bg-red-900/20 rounded transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
} 