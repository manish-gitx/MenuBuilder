import { Menu } from '@/lib/api'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, ShareIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'

interface MenuCardProps {
  menu: Menu
  onEdit: (menu: Menu) => void
  onDelete: (menu: Menu) => void
  onShare: (menu: Menu) => void
  onPreview: (menu: Menu) => void
}

export function MenuCard({ menu, onEdit, onDelete, onShare, onPreview }: MenuCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      {/* Colored top bar */}
      <div className={clsx(
        'h-1.5',
        menu.isPublic
          ? 'bg-gradient-hero'
          : 'bg-gradient-to-r from-gray-300 to-gray-400'
      )} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-foreground truncate">
                {menu.name}
              </h3>
              <span className={clsx(
                'flex-shrink-0 inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full',
                menu.isPublic
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}>
                {menu.isPublic ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            {menu.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {menu.description}
              </p>
            )}
          </div>

          {/* More Actions Dropdown */}
          <HeadlessMenu as="div" className="relative flex-shrink-0">
            <HeadlessMenu.Button className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </HeadlessMenu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-border focus:outline-none overflow-hidden">
                <div className="p-1">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEdit(menu)}
                        className={clsx(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-muted text-foreground' : 'text-foreground'
                        )}
                      >
                        <PencilIcon className="w-4 h-4 text-muted-foreground" />
                        Edit Menu
                      </button>
                    )}
                  </HeadlessMenu.Item>

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onPreview(menu)}
                        className={clsx(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-muted text-foreground' : 'text-foreground'
                        )}
                      >
                        <EyeIcon className="w-4 h-4 text-muted-foreground" />
                        Preview
                      </button>
                    )}
                  </HeadlessMenu.Item>

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onShare(menu)}
                        className={clsx(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-muted text-foreground' : 'text-foreground'
                        )}
                      >
                        <ShareIcon className="w-4 h-4 text-muted-foreground" />
                        Copy Share Link
                      </button>
                    )}
                  </HeadlessMenu.Item>

                  <div className="border-t border-border my-1 mx-2" />

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onDelete(menu)}
                        className={clsx(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                          active ? 'bg-red-50 text-red-600' : 'text-destructive'
                        )}
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete Menu
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5" />
            {menu._count?.categories || 0} categories
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            {formatDate(menu.createdAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="flex-1 flex items-center justify-center gap-2 h-9 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Menu
          </button>
          <button
            onClick={() => onPreview(menu)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-colors"
            title="Preview"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onShare(menu)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-colors"
            title="Copy Share Link"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
